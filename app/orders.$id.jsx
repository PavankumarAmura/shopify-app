import { useLoaderData } from "@remix-run/react";

export const loader = async ({ params }) => {
    const { order_id } = params;
    return order_id;
};

export default function ProductPage() {
    const order_id = useLoaderData();

    return (
        <div>
            <h1>Order ID:- {order_id}</h1>
        </div>
    );
}