import { ImageDetail } from "@aws-sdk/client-ecr"

export type AwsEcrImagesResponse = {
    items: ImageDetail[];
}

export type Image = {

}

export interface AmazonECRService {
    getListImages(region: string, repositoryName: string): Promise<AwsEcrImagesResponse>;
}