/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
	await knex.schema.createTable('rate_limits', (table) => {
		table.string('key').primary();
		table.integer('attempts').notNullable().defaultTo(0);
		table.timestamp('window_start').notNullable().defaultTo(knex.fn.now());
		table.timestamp('blocked_until').nullable();
		table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
	});

	await knex.raw(`
		CREATE INDEX idx_rate_limits_blocked_until ON rate_limits(blocked_until)
		WHERE blocked_until IS NOT NULL
	`);
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
	await knex.schema.dropTableIfExists('rate_limits');
}
