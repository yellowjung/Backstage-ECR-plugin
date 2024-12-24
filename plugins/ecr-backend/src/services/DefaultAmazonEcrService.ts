import { DescribeImagesCommand, ECRClient, ImageDetail } from "@aws-sdk/client-ecr";
import { AmazonECRService, AwsEcrImagesResponse } from "./types";

export class DefaultAmazonEcrService implements AmazonECRService {
    async getListImages(region: string, repositoryName: string): Promise<AwsEcrImagesResponse> {

        const ecrClient = new ECRClient({ region: "ap-northeast-2" });

        try {
            const command = new DescribeImagesCommand({ repositoryName });
            const response = await ecrClient.send(command);

            const items: ImageDetail[] = response.imageDetails || [];

            return { items };
        } catch (error) {
            console.error("Error fetching ECR images: ", error);
            const errorMessage = (error as any).message || "Unknown error";
            throw new Error(`Failed to fetch images for repository "${repositoryName}": ${errorMessage}`);
        }
    }
}