import { Page, Layout, Card, BlockStack, Link, Text } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(
    `#graphql
    query {
        orders(first: 10) {
            nodes {
                name
                id
                customer {
                    addresses {
                        name
                    }
                }
            }
        }
    }`,
  );

  const data = await response.json();
  return data.data.orders.nodes || null;
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
                const order_id = item.id.split("/").pop();
                return (
                  <Card key={index}>
                    <Text>
                      <Link url={`/orders/${order_id}`}>{item.name} - {item.customer.addresses[0].name}</Link>
                    </Text>
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
