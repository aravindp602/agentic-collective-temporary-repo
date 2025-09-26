// src/pages/login.js

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Link from "next/link";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Ref for the interactive background canvas
  const canvasRef = useRef(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.push(router.query.callbackUrl || '/dashboard');
    }
  }, [session, status, router]);

  // Interactive background animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let spots = [];
    let mouse = { x: undefined, y: undefined };

    const handleMouseMove = (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };
    window.addEventListener('mousemove', handleMouseMove);

    class Spot {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 0.1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.1) this.size -= 0.03;
      }
      draw() {
        ctx.fillStyle = '#cf3222'; // Use brand color
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function handleSpots() {
        for (let i = 0; i < spots.length; i++) {
            spots[i].update();
            spots[i].draw();
            for (let j = i; j < spots.length; j++) {
                const dx = spots[i].x - spots[j].x;
                const dy = spots[i].y - spots[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 90) {
                    ctx.beginPath();
                    ctx.strokeStyle = '#cf3222';
                    ctx.lineWidth = spots[i].size / 10;
                    ctx.moveTo(spots[i].x, spots[i].y);
                    ctx.lineTo(spots[j].x, spots[j].y);
                    ctx.stroke();
                }
            }
            if (spots[i].size <= 0.3) {
                spots.splice(i, 1); i--;
            }
        }
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (mouse.x !== undefined && mouse.y !== undefined) {
        spots.push(new Spot(mouse.x, mouse.y));
      }
      handleSpots();
      requestAnimationFrame(animate);
    }
    animate();

    const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleCredentialsSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    const result = await signIn('credentials', {
      redirect: false,
      email: email,
      password: password,
    });
    if (result.error) {
      setError(result.error);
    } else {
      router.push(router.query.callbackUrl || '/dashboard');
    }
  };

  const handleMagicLinkSignIn = async () => {
    setError(null);
    if (!email) {
        setError("Please enter your email address to receive a magic link.");
        return;
    }
    const result = await signIn('email', { email, redirect: false, callbackUrl: '/dashboard' });
    if (result.error) {
        setError(result.error);
    } else {
        router.push(`/auth/check-email?email=${email}`);
    }
  };

  if (status === "loading") { return <div className="full-page-message-wrapper"><div className="loading-page">Loading...</div></div>; }

  if (status === "unauthenticated") {
    return (
      <>
        <Head><title>Sign In | Agentic Collective</title></Head>
        <canvas ref={canvasRef} className="interactive-background"></canvas>
        <div className="auth-container">
          <div className="auth-box">
            <div className="auth-box-content">
                <Link href="/" className="logo anim-fade-in" style={{ animationDelay: '0.1s' }}>Agentic Collective</Link>
                <h1 className="anim-fade-in" style={{ animationDelay: '0.2s' }}>Welcome Back</h1>
                <p className="anim-fade-in" style={{ animationDelay: '0.3s' }}>Sign in to unlock your AI workforce.</p>

                <div className="social-logins anim-fade-in" style={{ animationDelay: '0.4s' }}>
                    <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })} className="social-login-btn google"><img src="/google-icon.svg" alt="Google" /> Continue with Google</button>
                    <button onClick={() => signIn('github', { callbackUrl: '/dashboard' })} className="social-login-btn github"><img src="/github-icon.svg" alt="GitHub" /> Continue with GitHub</button>
                </div>

                <div className="auth-separator anim-fade-in" style={{ animationDelay: '0.5s' }}><span>OR</span></div>
                
                <form onSubmit={handleCredentialsSignIn} className="credentials-form anim-fade-in" style={{ animationDelay: '0.6s' }}>
                  <div className="form-field animated-label">
                      <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder=" " required />
                      <label htmlFor="email">Email Address</label>
                  </div>
                  <div className="form-field animated-label">
                      <input type={showPassword ? "text" : "password"} id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder=" " />
                      <label htmlFor="password">Password</label>
                      <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                         {showPassword ? 'Hide' : 'Show'}
                      </button>
                  </div>
                  {error && <p className="auth-error">{error}</p>}
                  <button type="submit" className="cta-button">
                      <span className="shine"></span>Sign In
                  </button>
                  <button type="button" onClick={handleMagicLinkSignIn} className="magic-link-btn">Email me a Magic Link</button>
                </form>
                
                {/* --- THIS IS THE NEWLY ADDED SECTION --- */}
                <div className="auth-footer-text" style={{ marginTop: '16px', marginBottom: '-16px' }}>
                    <Link href="/forgot-password">Forgot Password?</Link>
                </div>
                
                <div className="auth-footer-text anim-fade-in" style={{ animationDelay: '0.7s' }}>
                    Don't have an account? <Link href="/signup">Sign up</Link>
                </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
}