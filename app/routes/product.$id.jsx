import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ params, request }) => {
  const { admin } = await authenticate.admin(request);
  const productId = params.id;

  const response = await admin.graphql(
    `#graphql
      query {
        product(id: "gid://shopify/Product/${productId}") {
            description
            handle
            title
            status
            featuredImage {
                url
            }
        }
      }`,
  );

  const data = await response.json();
  return data.data.product;
};

export default function ProductDetail() {
  const product = useLoaderData();

  if (!product) {
    return <SkeletonPage title="Loading..." />;
  }

  return (
    <Page>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <img
                src={product.featuredImage.url}
                alt={product.title}
                style={{ display: "block", width: "300px", height:"auto" }}
              />
              <Text>Title:- {product.title}</Text>
              <Text>Description:- {product.description}</Text>
              <Text>Handle:- {product.handle}</Text>
              <Text>Status:- {product.status}</Text>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
