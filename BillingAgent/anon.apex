/* Anonymous Apex to assign the default agent user for Billing_Refund.
   Instructions:
   1. Replace '005XXXXXXXXXXXX' with the User Id returned by:
        sf data query --query "SELECT Id FROM User WHERE Username='agent.user.03ecb5a0a609@salesforce.com' LIMIT 1" --json
   2. If your org uses a custom Agent Type object, update the SOQL and field names accordingly.
   3. Run with: sf apex execute -f anon.apex --target-org <your-org-alias>
*/

Id userId = '005fj00000FPlxZAAT'; // replace with real User Id

// Example for a managed-package or custom object storing agent types.
// Update object and field API names if different in your org.
try {
    // Attempt to find a typical Agent Type record by DeveloperName or Name
    List<sObject> matches = Database.query(
        'SELECT Id, Default_Agent_User__c FROM Agent_Type__c WHERE DeveloperName = \'Billing_Refund\' LIMIT 1'
    );

    if (!matches.isEmpty()) {
        sObject at = matches[0];
        at.put('Default_Agent_User__c', userId);
        update at;
        System.debug('Updated Agent_Type__c record with Id: ' + (String)at.get('Id'));
    } else {
        System.debug('No Agent_Type__c record found. Trying aiAuthoringBundle/Agent metadata approach is required.');
    }
} catch (Exception e) {
    System.debug('Error updating Agent_Type__c: ' + e.getMessage());
    System.debug('Attempting alternative update on a packaged Agent object (Agentforce packaged names may differ).');

    try {
        // Example fallback: packaged object name; adjust DeveloperName and field API name as needed.
        List<sObject> packaged = Database.query(
            'SELECT Id, Default_Agent_User__c FROM afx__Agent_Type__c WHERE DeveloperName = \'Billing_Refund\' LIMIT 1'
        );
        if (!packaged.isEmpty()) {
            sObject p = packaged[0];
            p.put('Default_Agent_User__c', userId);
            update p;
            System.debug('Updated afx__Agent_Type__c record with Id: ' + (String)p.get('Id'));
        } else {
            System.debug('No packaged agent type object found. Manual assignment via Setup or metadata deploy may be required.');
        }
    } catch (Exception e2) {
        System.debug('Fallback update failed: ' + e2.getMessage());
    }
}