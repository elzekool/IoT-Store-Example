<?php
/**
 * Submit Endpoint
 *
 * This endpoint submits the received to an RabbitMQ exchange.
 * Note that this file is for demonstration purpose only and is not
 * a guide on good programming(!)
 *
 * @author Elze Kool <info@kooldevelopent.nl>
 */

require_once dirname(__FILE__) . '/vendor/autoload.php';
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

$request = json_decode(file_get_contents("php://input"));
if (!is_array($request) || 'POST' !== $_SERVER['REQUEST_METHOD']) {
    header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
    exit;
}

$connection = new AMQPStreamConnection('iotrabbitexample_rabbitmq_1', 5672, 'guest', 'guest');
$channel = $connection->channel();

$channel->exchange_declare('orders', 'fanout', false, false, false);
$msg = new AMQPMessage(json_encode($request));
$channel->basic_publish($msg, 'orders');

$channel->close();
$connection->close();

