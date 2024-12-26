import { ImageDetail } from "@aws-sdk/client-ecr"
import { BackstageCredentials } from "@backstage/backend-plugin-api/index";

export type AwsEcrImagesResponse = {
    items: ImageDetail[];
}

export type Image = {

}

export interface AmazonECRService {
    getListImages(
        region: string,
        repositoryName: string,
        // credentials?: BackstageCredentials
    ): Promise<AwsEcrImagesResponse>;
}