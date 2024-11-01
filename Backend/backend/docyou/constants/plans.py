from docyou.model.defaults import SubsciptionPlans

subscription_plans = {
    SubsciptionPlans.BASIC.value: {
        'limit': 100,
        'price': 20
    },
    SubsciptionPlans.FLEX.value: {
        'limit': 500,
        'price': 85
    },
    SubsciptionPlans.FLEXPLUS.value: {
        'limit': 1000,
        'price': 150
    },
    SubsciptionPlans.ENTERPRISE.value: {
        'limit': 0,
        'price': 0
    },
    SubsciptionPlans.UNLIMITED.value: {
        'limit': 0,
        'price': 0
    },
}
