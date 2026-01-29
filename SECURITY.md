# Security Considerations

This document outlines security considerations for the Minecraft Server Shop website.

## Current Security Measures

✅ **Implemented:**
- Password hashing with bcrypt
- SQL injection protection via prepared statements
- Input validation for registration (username, email, Minecraft username)
- Session-based authentication
- XSS protection through EJS templating
- Minecraft username format validation
- Generic error messages to prevent user enumeration
- Proper purchase status tracking

## Security Alerts from CodeQL Analysis

### 1. Missing Rate Limiting (Medium Priority)
**Status:** Documented for production implementation

**Issue:** Route handlers that access the database are not rate-limited, which could allow abuse.

**Recommendation:** Add rate limiting for production using `express-rate-limit`:

```javascript
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
});

const purchaseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10
});

app.post('/login', authLimiter, ...);
app.post('/register', authLimiter, ...);
app.post('/purchase', purchaseLimiter, requireAuth, ...);
```

### 2. Clear-Text Cookie (High Priority for Production)
**Status:** Documented for production implementation

**Issue:** Session cookies are sent without SSL enforcement.

**Recommendation:** Enable secure cookies when using HTTPS:

```javascript
app.use(session({
  secret: config.server.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
```

### 3. Missing CSRF Token Validation (Medium Priority)
**Status:** Documented for production implementation

**Issue:** Form submissions are not protected against CSRF attacks.

**Recommendation:** Add CSRF protection using `csurf`:

```javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.use(csrfProtection);

// Pass CSRF token to all views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});
```

Add to forms:
```html
<input type="hidden" name="_csrf" value="<%= csrfToken %>">
```

### 4. WebSender Security (Critical for Production)
**Status:** API key support added, needs configuration

**Issue:** WebSender endpoint could be accessed without authentication.

**Recommendation:**
- Configure API key in `config.json`
- Use IP whitelisting on WebSender plugin
- Run WebSender on localhost only
- Use firewall rules to restrict access

## Production Deployment Checklist

Before deploying to production:

- [ ] Change `sessionSecret` to a strong random value
- [ ] Enable HTTPS and set `cookie.secure = true`
- [ ] Add rate limiting to all endpoints
- [ ] Implement CSRF protection
- [ ] Configure WebSender API key authentication
- [ ] Set up IP whitelisting for WebSender
- [ ] Use environment variables for sensitive configuration
- [ ] Enable logging and monitoring
- [ ] Set up regular database backups
- [ ] Review and test all security measures

## Vulnerability Reporting

If you discover a security vulnerability, please email the maintainer directly rather than opening a public issue.

## Known Limitations

1. **Payment Integration:** This is a demo application. Real payment processing is not implemented.
2. **Email Verification:** User emails are not verified.
3. **Password Reset:** No password recovery mechanism is implemented.
4. **Admin Panel:** No administrative interface for managing products/users.

## Best Practices

1. Keep all dependencies up to date
2. Use strong, unique session secrets
3. Enable HTTPS in production
4. Implement rate limiting
5. Add CSRF protection
6. Use environment variables for configuration
7. Regular security audits
8. Monitor logs for suspicious activity
