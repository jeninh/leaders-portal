export async function up(knex) {
	await knex.schema.alterTable('users', (t) => {
		t.text('hackclub_auth_id').nullable().unique();
		t.text('hackclub_primary_email').nullable();
		t.text('hackclub_slack_id').nullable();
	});
}

export async function down(knex) {
	await knex.schema.alterTable('users', (t) => {
		t.dropColumn('hackclub_auth_id');
		t.dropColumn('hackclub_primary_email');
		t.dropColumn('hackclub_slack_id');
	});
}
