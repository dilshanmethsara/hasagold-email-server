# Deploy Instructions

## 1. After creating GitHub repository, run:
cd clean-email-server
git remote add origin https://github.com/dilshanmethsara/hasagold-email-server.git
git push -u origin master

## 2. Deploy to Vercel:
1. Go to https://vercel.com
2. Click "New Project"
3. Import "hasagold-email-server" repository
4. Click "Deploy"

## 3. Add Environment Variables:
In Vercel project settings:
- SMTP_HOST = mail.privateemail.com
- SMTP_PORT = 587
- SMTP_USER = no-reply@hasagold.store
- SMTP_PASS = @hasa1234G

## 4. Test the function:
https://hasagold-email-server.vercel.app/api/send-email
