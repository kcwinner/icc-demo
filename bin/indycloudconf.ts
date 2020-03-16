#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { IndycloudconfStack } from '../lib/indycloudconf-stack';

const app = new cdk.App();
new IndycloudconfStack(app, 'IndycloudconfStack');
