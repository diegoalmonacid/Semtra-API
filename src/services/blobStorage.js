import { BlobServiceClient, StorageSharedKeyCredential,
    generateBlobSASQueryParameters, BlobSASPermissions, SASProtocol
 } from '@azure/storage-blob'
import 'dotenv/config'
// Enter your storage account name
const account = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const container = process.env.AZURE_STORAGE_CONTAINER_NAME;

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net/`, sharedKeyCredential);
const containerClient = blobServiceClient.getContainerClient(container);

// Create a service SAS for a blob
const getBlobSasUri = ( blobName ) => {
    const sasOptions = {
        containerName: containerClient.containerName,
        blobName: blobName,
        startsOn : new Date(),
        expiresOn : new Date(new Date().valueOf() + 300 * 1000),
        permissions : BlobSASPermissions.parse("r"),
        protocol: SASProtocol.HttpsAndHttp,
    };

    const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();

    return `${containerClient.getBlockBlobClient(blobName).url}?${sasToken}`;
}

export {
    containerClient,
    getBlobSasUri,
}
