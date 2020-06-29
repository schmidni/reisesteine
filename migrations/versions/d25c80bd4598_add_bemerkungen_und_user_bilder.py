"""add bemerkungen und user bilder

Revision ID: d25c80bd4598
Revises: 9a244e91d36d
Create Date: 2020-06-23 16:49:52.223043

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd25c80bd4598'
down_revision = '9a244e91d36d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('bild',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('filename', sa.String(length=64), nullable=True),
    sa.Column('stein', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['stein'], ['stein.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.add_column('stein', sa.Column('bemerkungen', sa.String(length=1), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('stein', 'bemerkungen')
    op.drop_table('bild')
    # ### end Alembic commands ###