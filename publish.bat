
jar -cMf ..\index.zip *
aws lambda update-function-code --function-name alexa-pig-latin --zip-file fileb://..\index.zip
del ..\index.zip
