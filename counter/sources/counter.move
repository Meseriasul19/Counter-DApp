module counter::counter {
    use sui::tx_context::sender;

    public struct Counter has key {
        id: sui::object::UID,
        owner: address,
        value: u64,
    }


    public fun create(ctx: &mut sui::tx_context::TxContext) {
        let creator = sender(ctx);

        let counter = Counter {
            id: sui::object::new(ctx),
            owner: creator,
            value: 0,
        };

        sui::transfer::transfer(counter, creator);
    }


    public fun increment(counter: &mut Counter, ctx: &sui::tx_context::TxContext) {
        let caller = sender(ctx);
        assert!(caller == counter.owner, 0);

        counter.value = counter.value + 1;
    }
}
