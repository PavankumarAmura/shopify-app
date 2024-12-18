import { useLoaderData } from "@remix-run/react";
import prisma from "../db.server";

export const loader = async ({ params, request }) => {
  let accessToken;
  try {
    const session = await prisma.session.findFirst({
      where: {
        shop: "ga4-setup.myshopify.com",
      },
    });

    if (!session || !session.accessToken) {
      throw new Error(`Access token not found for shop: GA4`);
    }
    accessToken = session.accessToken;
    console.log(accessToken);
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
  const order_id = params.id;
  const url = `https://ga4-setup.myshopify.com/admin/api/2023-10/orders/${order_id}.json`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch order data: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data);
  return data.order;
};

export default function OrderDetail() {
  const order = useLoaderData();

  if (!order) {
    return <SkeletonPage title="Loading..." />;
  }

  return (
    <div>
      <p>Order ID:- {order.id}</p>
      <p>Order Number:- {order.name}</p>
      <p>Name:- {order.billing_address.name}</p>
      <p>Email:- {order.contact_email}</p>  
      <p>Total:- {order.subtotal_price}</p>
    </div>
  );
}
