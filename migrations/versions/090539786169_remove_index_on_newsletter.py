"""remove index on newsletter

Revision ID: 090539786169
Revises: 131fab46ba72
Create Date: 2020-06-24 11:28:10.603588

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '090539786169'
down_revision = '131fab46ba72'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_person_newsletter', table_name='person')
    op.drop_index('ix_person_newsletter_registered', table_name='person')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_index('ix_person_newsletter_registered', 'person', ['newsletter_registered'], unique=False)
    op.create_index('ix_person_newsletter', 'person', ['newsletter'], unique=False)
    # ### end Alembic commands ###