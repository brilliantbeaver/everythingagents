public with sharing class FindOrder {
    public class ActionInput {
        @InvocableVariable(required=true)
        public String order_id;
    }

    public class ActionOutput {
        @InvocableVariable
        public String order_status;
        @InvocableVariable
        public String order_amount;
        @InvocableVariable
        public String refundable_until;
    }

    private class OrderRecord {
        String status;
        String amount;
        String refundableUntil;
        OrderRecord(String s, String a, String r) {
            this.status = s; this.amount = a; this.refundableUntil = r;
        }
    }

    private static final Map<String, OrderRecord> ORDERS = new Map<String, OrderRecord>{
        'INV-1001' => new OrderRecord('paid',     '$49.00',  '2026-06-01'),
        'INV-1002' => new OrderRecord('paid',     '$129.00', '2026-06-15'),
        'INV-1003' => new OrderRecord('refunded', '$75.00',  '2025-12-01'),
        'INV-1007' => new OrderRecord('paid',     '$129.00', '2026-06-01'),
        'INV-1010' => new OrderRecord('pending',  '$199.99', '2026-07-10'),
        'INV-1042' => new OrderRecord('paid',     '$24.50',  '2026-08-01')
    };

    @InvocableMethod(label='Find Order' description='Looks up an order/invoice by ID (e.g. INV-1007). Returns order_status, order_amount, refundable_until.')
    public static List<ActionOutput> invoke(List<ActionInput> inputs) {
        List<ActionOutput> results = new List<ActionOutput>();
        for (ActionInput inp : inputs) {
            ActionOutput out = new ActionOutput();
            String orderId = inp.order_id == null ? '' : inp.order_id.trim().toUpperCase();

            if (ORDERS.containsKey(orderId)) {
                OrderRecord r = ORDERS.get(orderId);
                out.order_status = r.status;
                out.order_amount = r.amount;
                out.refundable_until = r.refundableUntil;
            } else {
                out.order_status = 'not_found';
                out.order_amount = '';
                out.refundable_until = '';
            }
            results.add(out);
        }
        return results;
    }
}
