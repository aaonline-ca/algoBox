#!/usr/bin/env bash

[ -d "src/assets/css" ] || mkdir src/assets/css
cp node_modules/bootstrap-css-only/css/bootstrap.min.css src/assets/css/bootstrap.module.css
cp node_modules/mdbreact/dist/css/mdb.css src/assets/css/mdb.module.css
cp -R node_modules/mdbreact/dist/img src/assets/
