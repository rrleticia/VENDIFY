export async function sendOrderStatusEmail(orderId: string, status: string) {
  // mock: replace with real integration (SendGrid/SES/etc)
  console.info(`[email] Pedido ${orderId} agora está '${status}'.`);
  return new Promise((r) => setTimeout(r, 100));
}
