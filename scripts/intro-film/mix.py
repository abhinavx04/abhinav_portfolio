import numpy as np, sys
S=sys.argv[1]; R=48000
ld=lambda f: np.fromfile(S+f,np.float32).reshape(-1,2).astype(np.float64)
m,mu,vo=ld('/m48.raw'),ld('/mu48.raw'),ld('/vo48.raw')
OFF=29.111-30.0          # music.mp3 time = film time + OFF (valid locally near the end)
mus=lambda t0,n: mu[int((t0+OFF)*R):int((t0+OFF)*R)+n]
# refit gains at full rate (mono sums)
def gain(t0,t1):
    a=m[int(t0*R):int(t1*R)].sum(1); b=mus(t0,int(t1*R)-int(t0*R)).sum(1); return np.dot(a,b)/np.dot(b,b)
g_music=gain(36.0,38.1)
v0=int(38.17*R); n=len(vo)
seg=m[v0:v0+n].sum(1); X=np.stack([mus(38.17,n).sum(1),vo.sum(1)],1)
(gm_duck,g_vo),*_=np.linalg.lstsq(X,seg,rcond=None)
print('music gain %.3f, ducked %.3f, vo gain %.3f'%(g_music,gm_duck,g_vo))
END=40.90; T0=37.90; FADE_END=40.60
N=int(END*R); out=m[:N].copy()
t=np.arange(int(T0*R),N)/R
DUCK=38.17
env=np.where(t<DUCK, g_music+(gm_duck-g_music)*(t-T0)/(DUCK-T0),
             gm_duck*np.clip((FADE_END-t)/(FADE_END-DUCK),0,1)**1.5)   # dip under the voice, then fade to exactly 0
rec=mus(T0,len(t))*env[:,None]
vs=v0-int(T0*R); rec[vs:vs+n]+=vo*g_vo
x=int(0.05*R); w=np.linspace(0,1,x)[:,None]
a=int(T0*R)
out[a:a+x]=out[a:a+x]*(1-w)+rec[:x]*w
out[a+x:]=rec[x:]
peak=np.abs(out).max(); print('peak %.3f'%peak)
out.astype(np.float32).tofile(S+'/out48.raw')
