# Install

```
python -m venv venv
source venv/bin/activate
pip install markdown
python generate.py
```

# Deploy

```
aws s3 sync ./html s3://sfpc-ca-2023.bananabanana.me/ --exclude '.*' --exclude 'venv' --acl public-read
```
