import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
} from "@shopify/polaris";
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
                email
                phone
                totalPrice
                customer {
                    addresses {
                        address1
                        address2
                        city
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

export default function Orders() {
  const data = useLoaderData();
  return (
    <Page>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <div style={{ display: "grid", gap: "1rem" }}>
              {data.map((item, index) => {
                return (
                  <Card key={index}>
                    <Text>{item.name} - {item.customer.addresses[0].name}</Text>
                    <Text>Address :- {item.customer.addresses[0].city}</Text>
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
