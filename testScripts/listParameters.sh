#!/bin/bash
echo "Here are all parameters passed into this script:"
for parameter in "$@"; do echo $parameter; done
