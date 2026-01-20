const trigger = await prisma.alertTrigger.create({
  data: {
    alertId: alert.id,
    price: latest.price,
    triggeredAt: new Date(),
  },
});

await (await import('./notify')).notifyTrigger(trigger.id);
