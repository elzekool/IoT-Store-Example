#!/bin/bash
docker run -it --rm -v "${PWD}/webroot:/workspace" monostream/nodejs-gulp-bower npm $@
