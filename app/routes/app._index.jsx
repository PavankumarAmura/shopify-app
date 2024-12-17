import {
  Page,
  Layout,
  Card,
  BlockStack,
  Link,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(
    `#graphql
    query {
      products(first: 10) {
        edges {
          node {
            id,
            title
          }
        }
      }
    }`,
  );

  const data = await response.json();
  return data.data.products.edges;
};

export default function Index() {
  const data = useLoaderData();
  return (
    <Page>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <div style={{ display: "grid", gap: "1rem" }}>
              {data.map((item, index) => {
                const productId = item.node.id.split("/").pop();
                return (
                  <Card key={index}>
                    <Link url={`/product/${productId}`}>{item.node.title}</Link>
                  </Card>
                );
              })}
            </div>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
