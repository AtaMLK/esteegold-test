import { create } from "zustand";
import { supabase } from "./supabase";

export const useOrderStore = create((set) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {a
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.from("ordered_items").select(`
          id,
        quantity,
        unit_price,
        product:product_id (
          id,
          name,
          price,
          stock,
          material,
          description,
          categories:category_id (
            id,
            title,
            image_url,
            details
          ),
          product_images (
            id,
            image_url,
            is_primary
          )
        ),
        order:order_id (
          id,
          order_date,
          user_id,
          status,
          total_price,
          shipping_address,
          notes
        )
      `);
      if (error) throw error;
      set({ orders: data || [] });
    } catch (err) {
      console.log("Error fetching orders", err.message);
    } finally {
      set({ loading: false });
    }
  },
  setOrder: async ({ orderId, quantity, unit_price, productId }) => {
    set({ loading: true, error: null });
    try {
      // find if there is existind order
      const { data: existingItem, error: findError } = await supabase
        .from("ordered_items")
        .select("*")
        .eq("product_id", productId)
        .eq("order_id", orderId)
        .maybeSingle();
      if (!findError && findError !== "PGRST116") throw findError;

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        const { error: updateError } = await supabase
          .from("ordered_items")
          .update({ quantity: newQuantity })
          .eq("id", existingItem.id);

        if (updateError) throw updateError;
      } else {
        // add new order if not exist
        const { error: insertError } = await supabase
          .from("ordered_items")
          .insert([
            {
              product_id: productId,
              order_id: orderId,
              quantity,
              unit_price,
            },
          ]);
        if (insertError) throw insertError;
      }

      //update the cart
      await useOrderStore.getState().fetchOrders();
    } catch (insertError) {
      console.error("Error setting order", insertError.message);
      set({ error: insertError.message });
    } finally {
      set({ loading: false });
    }
  },
  createOrder: async (userId) => {
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "pending")
      .single();

    if (existingOrder) return existingOrder;

    const { data: newOrder, error: newError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userId,
          order_date: new Date().toISOString(),
          status: "pending",
          total_price: 0,
          shipping_address: "",
          notes: "",
        },
      ])
      .select()
      .single();

    if (newError) {
      console.error("Error creating order:", newError.message);
      return null;
    }
    return newOrder;
  },
  deleteOrderItem: async (itemId) => {
    const { error: deletError } = await supabase
      .from("ordered_items")
      .delete()
      .eq("id", itemId);
    if (deletError) {
      console.error("Delet failed", deletError.message);
    } else {
    }
    await useOrderStore.getState().fetchOrders();
  },
  updateQuantity: async (newQuantity, itemId) => {
    const { error: quantityError } = await supabase
      .from("ordered_items")
      .update({ quantity: newQuantity })
      .eq("id", itemId);
    if (quantityError) {
      console.error(
        "Erro Changing quantity",
        quantityError.message || quantityError
      );
    }
  },
  transferGuestCart: async (userId) => {
    const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");

    if (!userId || guestCart.length === 0) return;

    try {
      // get or create order for user
      const { data: existingOrder, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "pending")
        .maybeSingle();

      let orderId;

      if (existingOrder) {
        orderId = existingOrder.id;
      } else {
        const { data: newOrder, error: newOrderError } = await supabase
          .from("orders")
          .insert([
            {
              user_id: userId,
              order_date: new Date().toISOString(),
              status: "pending",
              total_price: 0,
              shipping_address: "",
              notes: "",
            },
          ])
          .select()
          .single();
        if (newOrderError) throw newOrderError;
        orderId = newOrder.id;
      }

      // adding or updating items
      for (const item of guestCart) {
        const { data: existingItem, error: findError } = await supabase
          .from("ordered_items")
          .select("*")
          .eq("product_id", item.productId)
          .eq("order_id", orderId)
          .maybeSingle();

        if (existingItem) {
          const newQuantity = existingItem.quantity + item.quantity;
          await supabase
            .from("ordered_items")
            .update({ quantity: newQuantity })
            .eq("id", existingItem.id);
        } else {
          await supabase.from("ordered_items").insert([
            {
              product_id: item.productId,
              order_id: orderId,
              quantity: item.quantity,
              unit_price: item.unit_price,
            },
          ]);
        }
      }

      // Deleteing guest card
      localStorage.removeItem("guest_cart");
      set({ guestCart: [] });

      //Updatin the list
      await useOrderStore.getState().fetchOrders();
    } catch (error) {
      console.error("Error transferring guest cart:", error.message);
    }
  },
}));
