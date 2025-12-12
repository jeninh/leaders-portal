export async function up(knex) {
	await knex.schema.createTable('club_cache', (t) => {
		t.text('club_name').primary();
		t.text('club_id');
		t.text('level');
		t.text('location');
		t.text('join_code');
		t.jsonb('ships').defaultTo('[]');
		t.jsonb('members').defaultTo('[]');
		t.timestamp('cached_at', { useTz: true }).defaultTo(knex.fn.now()).notNullable();
		t.index(['cached_at']);
	});

	await knex.schema.createTable('leader_clubs_cache', (t) => {
		t.text('email').primary();
		t.jsonb('club_names').defaultTo('[]');
		t.timestamp('cached_at', { useTz: true }).defaultTo(knex.fn.now()).notNullable();
		t.index(['cached_at']);
	});
}

export async function down(knex) {
	await knex.schema.dropTableIfExists('leader_clubs_cache');
	await knex.schema.dropTableIfExists('club_cache');
}
