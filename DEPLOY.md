## Deploy (Vercel) + Custom Domain (Namecheap)

### Fix: “Invalid configuration” on Vercel domain
This happens when the DNS records on Namecheap do not match what Vercel expects.

#### Option A (recommended): Use Vercel DNS nameservers (simplest)
- Vercel → Project → Settings → Domains → select your domain → **Vercel DNS**
- Copy the **Nameservers** Vercel shows (usually 2)
- Namecheap → Domain List → Manage → **Nameservers**
  - Set to **Custom DNS**
  - Paste the Vercel nameservers
- Wait 5–30 minutes (sometimes up to 24 hours), then click **Refresh** in Vercel.

#### Option B: Keep Namecheap DNS (add A/CNAME records)
Vercel will show the exact records required for your domain. Add them in Namecheap:

Namecheap → Domain List → Manage → **Advanced DNS**

1) **A record (apex/root)**
- Type: **A**
- Host: **@**
- Value: **(copy the IP shown by Vercel on the domain screen)**
- TTL: **Automatic**

2) **CNAME for www**
- Type: **CNAME**
- Host: **www**
- Value: **cname.vercel-dns.com**
- TTL: **Automatic**

3) Remove conflicts
If you already have any of these, delete/replace them:
- Another **A** record for **@**
- Any **CNAME** for **@**
- URL Redirect records for **@** or **www**
- Parking/hosting records that override root

After changes:
- Wait for DNS propagation (5–30 minutes typical; can be longer)
- Vercel → Domains → click **Refresh**

### Notes
- Your `*.vercel.app` URL is controlled by the **Vercel project name**, not code.
- Underscores `_` are typically not allowed in domains/subdomains. Prefer `bakht-ali.vercel.app`.

