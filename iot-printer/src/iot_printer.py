import pika
import sys
import json
import Image
import os
from Adafruit_Thermal import *

rabbitmq_host = os.getenv('AMQP_HOST', '127.0.0.1')
rabbitmq_channel = 'orders'
printer = Adafruit_Thermal("/dev/ttyAMA0", 19200, timeout=5)

def callback(ch, method, properties, body):
    """AMQP Message Received callback"""

    items = json.loads(body)
    if type(items) != type([]):
        return

    printer.wake()
    printer.feed(1)
    printer.printImage(Image.open('/src/cart.png'), True)
    printer.feed(1)
    printer.println("-"*32)

    for item in items:
        if type(item) != type({}):
            continue

        if not all (k in item for k in (u'title', u'qty', u'price')):
            continue

        printer.println(
            '{:>2}x {:<16} {:>7} EUR'.format(
                item[u'qty'],
                item[u'title'][0:16],
                '{:.2f}'.format(item[u'price']).replace('.', ',')
            )
        )

    printer.println("-"*32)
    printer.feed(1)
    printer.println("Thank you for shopping with us")
    printer.println("Have a nice day")
    printer.feed(3)


try:
    # Initialize RabbitMQ connection/channel
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=rabbitmq_host))
    channel = connection.channel()

    # Declare exchange
    channel.exchange_declare(exchange=rabbitmq_channel, type='fanout')

    # Attach new queue to exchange
    result = channel.queue_declare(exclusive=True)
    queue_name = result.method.queue
    channel.queue_bind(exchange=rabbitmq_channel, queue=queue_name)

    # Connect to printer
    printer.begin(128)

    print(' [*] Waiting for logs. To exit press CTRL+C')
    # Consume
    channel.basic_consume(callback, queue=queue_name, no_ack=True)
    channel.start_consuming()

except KeyboardInterrupt:
    print 'Interrupted'
    sys.exit(0)
