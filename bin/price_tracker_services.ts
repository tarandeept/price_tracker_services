#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { PriceTrackerServicesStack } from '../lib/price_tracker_services-stack';

const app = new cdk.App();
new PriceTrackerServicesStack(app, 'PriceTrackerServicesStack');
