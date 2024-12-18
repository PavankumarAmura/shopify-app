import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack
} from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ params, request }) => {
  const order_id = params.id;
  return order_id;
};

export default function OrderDetail() {
  const order_id = useLoaderData();

  if (!order_id) {
    return <SkeletonPage title="Loading..." />;
  }

  return (
    <Page>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
            ${order_id}
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
