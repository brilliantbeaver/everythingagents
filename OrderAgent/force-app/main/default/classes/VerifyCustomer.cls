public with sharing class VerifyCustomer {
    public class ActionInput {
        @InvocableVariable(required=true)
        public String email;
    }

    public class ActionOutput {
        @InvocableVariable
        public String customer_id;
        @InvocableVariable
        public String verified;
    }

    private static final Map<String, String> KNOWN_CUSTOMERS = new Map<String, String>{
        'alice@salesforce.com'    => 'cust_100',
        'bob@salesforce.com'      => 'cust_101',
        'carol@salesforce.com'    => 'cust_102',
        'pmui@salesforce.com'     => 'cust_103',
        'support@salesforce.com'  => 'cust_104'
    };

    @InvocableMethod(label='Verify Customer' description='Verifies a customer by email. Valid emails end in @salesforce.com. Returns customer_id and verified flag.')
    public static List<ActionOutput> invoke(List<ActionInput> inputs) {
        List<ActionOutput> results = new List<ActionOutput>();
        for (ActionInput inp : inputs) {
            ActionOutput out = new ActionOutput();
            String email = inp.email == null ? '' : inp.email.trim().toLowerCase();

            if (KNOWN_CUSTOMERS.containsKey(email)) {
                out.customer_id = KNOWN_CUSTOMERS.get(email);
                out.verified = 'true';
            } else {
                out.customer_id = '';
                out.verified = 'false';
            }
            results.add(out);
        }
        return results;
    }
}
