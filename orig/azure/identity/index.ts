// Copyright 2016-2019, Pulumi Corporation.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as azure from "@pulumi/azure";
import * as config from "./config";

let resourceGroup = new azure.core.ResourceGroup(config.name, { location: config.location });

// Create the AD service principal for the K8s cluster.
let adApp = new azure.ad.Application(`${config.name}-app`);
let adSp = new azure.ad.ServicePrincipal(`${config.name}-sp`, {
    applicationId: adApp.applicationId,
});
let adSpPassword = new azure.ad.ServicePrincipalPassword(`${config.name}-password`, {
    servicePrincipalId: adSp.id,
    value: config.password,
    endDate: "2099-01-01T00:00:00Z",
});

//
// Export required properties for downstream stacks.
//

export const resourceGroupName = resourceGroup.name;
export const applicationID = adApp.applicationId;
export const servicePrincipalPassword = adSpPassword.value;
export const location = config.location;
