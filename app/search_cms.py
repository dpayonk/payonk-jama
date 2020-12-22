import os, sys
from payonk import cms

COSMIC_READ_KEY = os.environ.get('COSMIC_READ_KEY')

def main():
    content = cms.Api('payonk-jama', read_key=COSMIC_READ_KEY)
    slug = content.object('adding-wsl-ssh-server')
    print(slug)


if __name__ == '__main__':
    main()