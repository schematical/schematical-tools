import { AWS } from '@serverless/typescript';

import gql from '@functions/gql';

const serverlessConfiguration: AWS = {
  service: 'schematical-web-tools-lambda',
  frameworkVersion: '3',
  plugins: [
      'serverless-webpack',
      'serverless-offline'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      // shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { gql },
  package: { individually: true },
};

module.exports = serverlessConfiguration;
