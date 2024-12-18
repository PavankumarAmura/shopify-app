import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack
} from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import prisma from "../db.server";

export const loader = async ({ params, request }) => {
  let token
  try {
    const session = await prisma.session.findFirst({
      where: {
        shop: "ga4-setup.myshopify.com",
      },
    });

    if (!session || !session.accessToken) {
      throw new Error(`Access token not found for shop: ${shop}`);
    }
    token = session.accessToken;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
  const order_id = params.id;
  console.log(order_id);
  return token;
};

export default function OrderDetail() {
  const token = useLoaderData();

  if (!token) {
    return <SkeletonPage title="Loading..." />;
  }

  return (
    <Page>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
            ${token}
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
