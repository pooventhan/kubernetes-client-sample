import * as k8s from '@kubernetes/client-node';

main()
.then(() => {
    console.log('execution complete.');
})
.catch(err => { 
    console.error(err);
    process.exitCode = 1;
});

async function main(): Promise<void>{

    const kc = new k8s.KubeConfig();
    //kc.loadFromDefault();
    kc.loadFromFile('/root/.kube/config');

    const k8sApi = kc.makeApiClient(k8s.AppsV1Api);

    const deploymentResponse = await k8sApi.listNamespacedDeployment('dev-dell');

    deploymentResponse.body.items.forEach(deployment => {
        console.log(`${deployment.metadata?.name} : ${getImageVersion(deployment.spec?.template?.spec?.containers?.[0]?.image)}`);
    });
}

function getImageVersion(image: string | undefined): string {

    if(image) {
        const parts = image.split(':');
        return parts[1];
    }

    return '';
}