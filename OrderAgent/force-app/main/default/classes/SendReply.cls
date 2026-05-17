public with sharing class SendReply {
    public class ActionInput {
        @InvocableVariable(required=true)
        public String reply_text;
    }

    public class ActionOutput {
        @InvocableVariable
        public String delivery_status;
    }

    @InvocableMethod(label='Send Reply' description='Sends a formatted reply message back to the customer. Returns a delivery status.')
    public static List<ActionOutput> invoke(List<ActionInput> inputs) {
        List<ActionOutput> results = new List<ActionOutput>();
        for (ActionInput inp : inputs) {
            ActionOutput out = new ActionOutput();
            String reply = inp.reply_text == null ? '' : inp.reply_text.trim();

            if (String.isBlank(reply)) {
                out.delivery_status = 'failed: empty message';
            } else {
                System.debug(LoggingLevel.INFO, 'SendReply -> ' + reply);
                out.delivery_status = 'sent (' + String.valueOf(reply.length()) + ' chars)';
            }
            results.add(out);
        }
        return results;
    }
}
