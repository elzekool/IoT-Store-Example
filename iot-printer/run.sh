#!/bin/bash
docker run -it --rm -v "${PWD}/src:/src" --privileged $@ elzekool/iot_printer python /src/iot_printer.py
