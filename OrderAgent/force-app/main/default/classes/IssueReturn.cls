public with sharing class IssueReturn {
    public class ActionInput {
        @InvocableVariable(required=true)
        public String order_id;
    }

    public class ActionOutput {
        @InvocableVariable
        public String refund_confirmation;
    }

    @InvocableMethod(label='Issue Return' description='Issues a refund for an order ID. Returns a refund confirmation code.')
    public static List<ActionOutput> invoke(List<ActionInput> inputs) {
        List<ActionOutput> results = new List<ActionOutput>();
        for (ActionInput inp : inputs) {
            ActionOutput out = new ActionOutput();
            String orderId = inp.order_id == null ? '' : inp.order_id.trim().toUpperCase();

            if (String.isBlank(orderId)) {
                out.refund_confirmation = 'ERROR: missing order_id';
            } else {
                String suffix = String.valueOf(Math.abs(Crypto.getRandomInteger())).left(6);
                out.refund_confirmation = 'RFND-' + orderId + '-' + suffix;
            }
            results.add(out);
        }
        return results;
    }
}
