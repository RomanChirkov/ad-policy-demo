
/*
 ============== DO NOT ALTER ANYTHING BELOW THIS LINE ! ============

 Adobe Visitor API for JavaScript version: 1.1
 Copyright 1996-2013 Adobe, Inc. All Rights Reserved
 More info available at http://www.omniture.com
 */
function Visitor(k) {
    var a = this;
    a.version = "1.1";
    var f = window;
    f.s_c_in || (f.s_c_il = [], f.s_c_in = 0);
    a._c = "Visitor";
    a._il = f.s_c_il;
    a._in = f.s_c_in;
    a._il[a._in] = a;
    f.s_c_in++;
    var i = f.document,
        h = f.z;
    h || (h = null);
    var j = f.A;
    j || (j = !0);
    var l = f.w;
    l || (l = !1);
    a.s = function () {
        var a;
        !a && f.location && (a = f.location.hostname);
        if (a)
            if (/^[0-9.]+$/.test(a)) a = "";
            else {
                var d = a.split("."),
                    b = d.length - 1,
                    e = b - 1;
                1 < b && 2 >= d[b].length && 0 > ",am,aq,ax,cc,cf,cg,ch,cv,cz,de,dj,dk,eu,fm,fo,ga,gd,gf,gl,gm,gq,gs,gw,hm,li,lu,md,mh,mp,mq,ms,ne,nl,nu,pm,si,sk,sm,sr,su,tc,td,tf,tg,tk,tv,va,vg,vu,wf,yt,".indexOf("," +
                    d[b] + ",") && e--;
                if (0 < e)
                    for (a = ""; b >= e;) a = d[b] + (a ? "." : "") + a, b--
            }
        return a
    };
    a.cookieRead = function (a) {
        var d = (";" + i.cookie).split(" ").join(";"),
            b = d.indexOf(";" + a + "="),
            e = 0 > b ? b : d.indexOf(";", b + 1);
        return 0 > b ? "" : decodeURIComponent(d.substring(b + 2 + a.length, 0 > e ? d.length : e))
    };
    a.cookieWrite = function (c, d, b) {
        var e = a.cookieLifetime,
            g, d = "" + d,
            e = e ? ("" + e).toUpperCase() : "";
        b && "SESSION" != e && "NONE" != e ? (g = "" != d ? parseInt(e ? e : 0) : -60) ? (b = new Date, b.setTime(b.getTime() + 1E3 * g)) : 1 == b && (b = new Date, g = b.getYear(), b.setYear(g + 2 + (1900 >
            g ? 1900 : 0))) : b = 0;
        return c && "NONE" != e ? (i.cookie = c + "=" + encodeURIComponent(d) + "; path=/;" + (b ? " expires=" + b.toGMTString() + ";" : "") + (a.k ? " domain=" + a.k + ";" : ""), a.cookieRead(c) == d) : 0
    };
    a.b = h;
    a.j = function (a, d) {
        try {
            "function" == typeof a ? a.apply(f, d) : a[1].apply(a[0], d)
        } catch (b) {}
    };
    a.u = function (c, d) {
        d && (a.b == h && (a.b = {}), void 0 == a.b[c] && (a.b[c] = []), a.b[c].push(d))
    };
    a.p = function (c, d) {
        if (a.b != h) {
            var b = a.b[c];
            if (b)
                for (; 0 < b.length;) a.j(b.shift(), d)
        }
    };
    a.c = h;
    a.t = function (c, d, b) {
        !d && b && b();
        var e = i.getElementsByTagName("HEAD")[0],
            g = i.createElement("SCRIPT");
        g.type = "text/javascript";
        g.setAttribute("async", "async");
        g.src = d;
        e.firstChild ? e.insertBefore(g, e.firstChild) : e.appendChild(g);
        a.c == h && (a.c = {});
        a.c[c] = setTimeout(b, a.loadTimeout)
    };
    a.q = function (c) {
        a.c != h && a.c[c] && (clearTimeout(a.c[c]), a.c[c] = 0)
    };
    a.l = l;
    a.m = l;
    a.isAllowed = function () {
        if (!a.l && (a.l = j, a.cookieRead(a.cookieName) || a.cookieWrite(a.cookieName, "T", 1))) a.m = j;
        return a.m
    };
    a.a = h;
    a.n = l;
    a.i = function () {
        if (!a.n) {
            a.n = j;
            var c = a.cookieRead(a.cookieName),
                d, b, e, g, f = new Date;
            if (c &&
                "T" != c) {
                c = c.split("|");
                1 == c.length % 2 && c.pop();
                for (d = 0; d < c.length; d += 2)
                    if (b = c[d].split("-"), e = b[0], g = c[d + 1], b = 1 < b.length ? parseInt(b[1]) : 0, e && g && (!b || f.getTime() < 1E3 * b)) a.f(e, g, 1), 0 < b && (a.a["expire" + e] = b)
            }
            if (!a.d("MCAID") && (c = a.cookieRead("s_vi"))) c = c.split("|"), 1 < c.length && 0 <= c[0].indexOf("v1") && (g = c[1], d = g.indexOf("["), 0 <= d && (g = g.substring(0, d)), g && g.match(/^[0-9a-fA-F\-]+$/) && a.f("MCAID", g))
        }
    };
    a.v = function () {
        var c = "",
            d, b;
        for (d in a.a)!Object.prototype[d] && a.a[d] && "expire" != d.substring(0, 6) && (b = a.a[d],
            c += (c ? "|" : "") + d + (a.a["expire" + d] ? "-" + a.a["expire" + d] : "") + "|" + b);
        a.cookieWrite(a.cookieName, c, 1)
    };
    a.d = function (c) {
        return a.a != h ? a.a[c] : h
    };
    a.f = function (c, d, b) {
        a.a == h && (a.a = {});
        a.a[c] = d;
        b || a.v()
    };
    a.o = function (c, d) {
        var b = new Date;
        b.setTime(b.getTime() + 1E3 * d);
        a.a == h && (a.a = {});
        a.a["expire" + c] = Math.floor(b.getTime() / 1E3)
    };
    a.r = function (a) {
        if (a && ("object" == typeof a && (a = a.visitorID ? a.visitorID : a.id ? a.id : a.uuid ? a.uuid : "" + a), a && (a = a.toUpperCase(), "NOTARGET" == a && (a = "NONE")), !a || "NONE" != a && !a.match(/^[0-9a-fA-F\-]+$/))) a =
            "";
        return a
    };
    a.g = function (c, d) {
        var b;
        a.q(c);
        b = a.d(c);
        b || (b = a.r(d)) && a.f(c, b);
        if ("object" == typeof d) {
            var e = 86400;
            "MCAAMID" == c && (void 0 != d.id_sync_ttl && d.id_sync_ttl && (e = parseInt(d.id_sync_ttl)), a.o(c, e), a.o("MCAAMLH", e), d.dcs_region && a.f("MCAAMLH", d.dcs_region))
        }
        a.p(c, ["NONE" != b ? b : ""])
    };
    a.e = h;
    a.h = function (c, d, b) {
        if (a.isAllowed()) {
            a.i();
            var e = a.d(c);
            if (e) return "NONE" == e && a.j(b, [""]), "NONE" != e ? e : "";
            if (a.e == h || void 0 == a.e[c]) a.e == h && (a.e = {}), a.e[c] = j, a.t(c, d, function () {
                if (!a.d(c)) {
                    var b = "";
                    if ("MCMID" ==
                        c) {
                        var d = b = "",
                            e, f, h = 10,
                            i = 10;
                        for (e = 0; 19 > e; e++) f = Math.floor(Math.random() * h), b += "0123456789".substring(f, f + 1), h = 0 == e && 9 == f ? 3 : 10, f = Math.floor(Math.random() * i), d += "0123456789".substring(f, f + 1), i = 0 == e && 9 == f ? 3 : 10;
                        b += d
                    }
                    a.g(c, b)
                }
            });
            a.u(c, b)
        }
        return ""
    };
    a.setMarketingCloudVisitorID = function (c) {
        a.g("MCMID", c)
    };
    a.getMarketingCloudVisitorID = function (c) {
        var d = a.marketingCloudServer,
            b = "";
        a.loadSSL && a.marketingCloudServerSecure && (d = a.marketingCloudServerSecure);
        d && (b = "http" + (a.loadSSL ? "s" : "") + "://" + d + "/id?d_rtbd=json&d_cid=" +
            encodeURIComponent(a.namespace) + "&d_cb=s_c_il%5B" + a._in + "%5D.setMarketingCloudVisitorID");
        return a.h("MCMID", b, c)
    };
    a.setAudienceManagerVisitorID = function (c) {
        a.g("MCAAMID", c)
    };
    a.getAudienceManagerVisitorID = function (c) {
        var d = a.audienceManagerServer,
            b = "";
        a.loadSSL && a.audienceManagerServerSecure && (d = a.audienceManagerServerSecure);
        d && (b = "http" + (a.loadSSL ? "s" : "") + "://" + d + "/id?d_rtbd=json&d_cb=s_c_il%5B" + a._in + "%5D.setAudienceManagerVisitorID");
        return a.h("MCAAMID", b, c)
    };
    a.getAudienceManagerLocationHint =
        function () {
            a.i();
            var c = a.d("MCAAMLH");
            return c ? c : 0
        };
    a.setAnalyticsVisitorID = function (c) {
        a.i();
        a.g("MCAID", c)
    };
    a.getAnalyticsVisitorID = function (c) {
        var d = a.trackingServer,
            b = "";
        a.loadSSL && a.trackingServerSecure && (d = a.trackingServerSecure);
        d && (b = "http" + (a.loadSSL ? "s" : "") + "://" + d + "/id?callback=s_c_il%5B" + a._in + "%5D.setAnalyticsVisitorID");
        return a.h("MCAID", b, c)
    };
    a.getVisitorID = function (c) {
        return a.getMarketingCloudVisitorID(c)
    };
    a.namespace = k;
    a.cookieName = "AMCV_" + k;
    a.k = a.s();
    a.loadSSL = 0 <= f.location.protocol.toLowerCase().indexOf("https");
    a.loadTimeout = 500;
    a.marketingCloudServer = a.audienceManagerServer = "dpm.demdex.net"
}
Visitor.getInstance = function (k) {
    var a, f = window.s_c_il,
        i;
    if (f)
        for (i = 0; i < f.length; i++)
            if ((a = f[i]) && "Visitor" == a._c && a.namespace == k) return a;
    return new Visitor(k)
};



/* HERE STARTS THE MEDIA MODULE */

var i = null;

function F() {
    return function () {}
}

function AppMeasurement_Module_Media(s) {
    var m = this;
    m.s = s;
    var w = window;
    if (!w.s_c_in) w.s_c_il = [], w.s_c_in = 0;
    m._il = w.s_c_il;
    m._in = w.s_c_in;
    m._il[m._in] = m;
    w.s_c_in++;
    m._c = "s_m";
    m.list = [];
    m.open = function (d, e, g, j) {
        var c = {}, a = new Date,
            b = "",
            f;
        e || (e = -1);
        if (d && g) {
            if (!m.list) m.list = {};
            m.list[d] && m.close(d);
            if (j && j.id) b = j.id;
            if (b)
                for (f in m.list)!Object.prototype[f] && m.list[f] && m.list[f].Bf == b && m.close(m.list[f].name);
            c.name = d;
            c.length = e;
            c.$b = 0;
            c.Q = 0;
            c.playerName = m.playerName ? m.playerName : g;
            c.Bf = b;
            c.Qd = 0;
            c.V =
                0;
            c.timestamp = Math.floor(a.getTime() / 1E3);
            c.ua = 0;
            c.Zb = c.timestamp;
            c.P = -1;
            c.gc = "";
            c.ca = -1;
            c.kc = 0;
            c.Bd = {};
            c.nc = 0;
            c.Ea = 0;
            c.R = "";
            c.Bb = 0;
            c.Jd = 0;
            c.fc = 0;
            c.lc = 0;
            c.ra = !1;
            c.wb = "";
            c.ac = "";
            c.bc = 0;
            c.Wb = !1;
            c.xa = "";
            c.complete = 0;
            c.nf = 0;
            c.ub = 0;
            c.vb = 0;
            m.list[d] = c;
            c.Fd = !1
        }
    };
    m.openAd = function (d, e, g, j, c, a, b, f) {
        var h = {};
        m.open(d, e, g, f);
        if (h = m.list[d]) h.ra = !0, h.wb = j, h.ac = c, h.bc = a, h.xa = b
    };
    m.De = function (d) {
        var e = m.list[d];
        m.list[d] = 0;
        e && e.monitor && clearTimeout(e.monitor.J)
    };
    m.close = function (d) {
        m.fa(d, 0, -1)
    };
    m.play = function (d,
                       e, g, j) {
        var c = m.fa(d, 1, e, g, j);
        if (c && !c.monitor) c.monitor = {}, c.monitor.update = function () {
            c.ua == 1 && m.fa(c.name, 3, -1);
            c.monitor.J = setTimeout(c.monitor.update, 1E3)
        }, c.monitor.update()
    };
    m.click = function (d, e) {
        m.fa(d, 7, e)
    };
    m.complete = function (d, e) {
        m.fa(d, 5, e)
    };
    m.stop = function (d, e) {
        m.fa(d, 2, e)
    };
    m.track = function (d) {
        m.fa(d, 4, -1)
    };
    m.lf = function (d, e) {
        var g = "a.media.",
            j = d.linkTrackVars,
            c = d.linkTrackEvents,
            a = "m_i",
            b, f = d.contextData,
            h;
        if (e.ra) {
            g += "ad.";
            if (e.wb) f["a.media.name"] = e.wb, f[g + "pod"] = e.ac, f[g + "podPosition"] =
                e.bc;
            if (!e.nc) f[g + "CPM"] = e.xa
        }
        if (e.Wb) f[g + "clicked"] = !0, e.Wb = !1;
        f["a.contentType"] = "video" + (e.ra ? "Ad" : "");
        f["a.media.channel"] = m.channel;
        f[g + "name"] = e.name;
        f[g + "playerName"] = e.playerName;
        if (e.length > 0) f[g + "length"] = e.length;
        f[g + "timePlayed"] = Math.floor(e.V);
        Math.floor(e.V) > 0 && (f[g + "timePlayed"] = Math.floor(e.V));
        if (!e.nc) f[g + "view"] = !0, a = "m_s", m.Heartbeat && m.Heartbeat.enabled && (a = e.ra ? m.__primetime ? "mspa_s" : "msa_s" : m.__primetime ? "msp_s" : "ms_s"), e.nc = 1;
        if (e.R) {
            f[g + "segmentNum"] = e.Ea;
            f[g + "segment"] =
                e.R;
            if (e.Bb > 0) f[g + "segmentLength"] = e.Bb;
            e.fc && e.V > 0 && (f[g + "segmentView"] = !0)
        }
        if (!e.nf && e.complete) f[g + "complete"] = !0, e.Vf = 1;
        if (e.ub > 0) f[g + "milestone"] = e.ub;
        if (e.vb > 0) f[g + "offsetMilestone"] = e.vb;
        if (j)
            for (h in f) Object.prototype[h] || (j += ",contextData." + h);
        b = f["a.contentType"];
        d.pe = a;
        d.pev3 = b;
        var D, C;
        if (m.contextDataMapping) {
            if (!d.events2) d.events2 = "";
            j && (j += ",events");
            for (h in m.contextDataMapping)
                if (!Object.prototype[h]) {
                    a = h.length > g.length && h.substring(0, g.length) == g ? h.substring(g.length) : "";
                    b = m.contextDataMapping[h];
                    if (typeof b == "string") {
                        D = b.split(",");
                        for (C = 0; C < D.length; C++) b = D[C], h == "a.contentType" ? (j && (j += "," + b), d[b] = f[h]) : a == "view" || a == "segmentView" || a == "clicked" || a == "complete" || a == "timePlayed" || a == "CPM" ? (c && (c += "," + b), a == "timePlayed" || a == "CPM" ? f[h] && (d.events2 += (d.events2 ? "," : "") + b + "=" + f[h]) : f[h] && (d.events2 += (d.events2 ? "," : "") + b)) : a == "segment" && f[h + "Num"] ? (j && (j += "," + b), d[b] = f[h + "Num"] + ":" + f[h]) : (j && (j += "," + b), d[b] = f[h])
                    } else if (a == "milestones" || a == "offsetMilestones") h = h.substring(0, h.length - 1), f[h] &&
                        m.contextDataMapping[h + "s"][f[h]] && (c && (c += "," + m.contextDataMapping[h + "s"][f[h]]), d.events2 += (d.events2 ? "," : "") + m.contextDataMapping[h + "s"][f[h]]);
                    f[h] && (f[h] = 0);
                    a == "segment" && f[h + "Num"] && (f[h + "Num"] = 0)
                }
        }
        d.linkTrackVars = j;
        d.linkTrackEvents = c
    };
    m.fa = function (d, e, g, j, c) {
        var a = {}, b = (new Date).getTime() / 1E3,
            f, h, D = m.trackVars,
            C = m.trackEvents,
            G = m.trackSeconds,
            t = m.trackMilestones,
            u = m.trackOffsetMilestones,
            A = m.segmentByMilestones,
            x = m.segmentByOffsetMilestones,
            o, p, y = 1,
            l = {}, H;
        if (!m.channel) m.channel = m.s.w.location.hostname;
        if (a = d && m.list && m.list[d] ? m.list[d] : 0) {
            if (a.ra) G = m.adTrackSeconds, t = m.adTrackMilestones, u = m.adTrackOffsetMilestones, A = m.adSegmentByMilestones, x = m.adSegmentByOffsetMilestones;
            g < 0 && (g = a.ua == 1 && a.Zb > 0 ? b - a.Zb + a.P : a.P);
            a.length > 0 && (g = g < a.length ? g : a.length);
            g < 0 && (g = 0);
            a.$b = g;
            if (a.length > 0) a.Q = a.$b / a.length * 100, a.Q = a.Q > 100 ? 100 : a.Q;
            if (a.P < 0) a.P = g;
            H = a.kc;
            l.name = d;
            l.ad = a.ra;
            l.length = a.length;
            l.openTime = new Date;
            l.openTime.setTime(a.timestamp * 1E3);
            l.offset = a.$b;
            l.percent = a.Q;
            l.playerName = a.playerName;
            l.mediaEvent =
                a.ca < 0 ? "OPEN" : e == 1 ? "PLAY" : e == 2 ? "STOP" : e == 3 ? "MONITOR" : e == 4 ? "TRACK" : e == 5 ? "COMPLETE" : e == 7 ? "CLICK" : "CLOSE";
            if (e > 2 || e != a.ua && (e != 2 || a.ua == 1)) {
                if (!c) j = a.Ea, c = a.R;
                if (e) {
                    if (e == 1) a.P = g;
                    if ((e <= 3 || e >= 5) && a.ca >= 0)
                        if (y = !1, D = C = "None", a.ca != g) {
                            h = a.ca;
                            if (h > g) h = a.P, h > g && (h = g);
                            o = t ? t.split(",") : 0;
                            if (a.length > 0 && o && g >= h)
                                for (p = 0; p < o.length; p++)
                                    if ((f = o[p] ? parseFloat("" + o[p]) : 0) && h / a.length * 100 < f && a.Q >= f) y = !0, p = o.length, l.mediaEvent = "MILESTONE", a.ub = l.milestone = f;
                            if ((o = u ? u.split(",") : 0) && g >= h)
                                for (p = 0; p < o.length; p++)
                                    if ((f =
                                        o[p] ? parseFloat("" + o[p]) : 0) && h < f && g >= f) y = !0, p = o.length, l.mediaEvent = "OFFSET_MILESTONE", a.vb = l.offsetMilestone = f
                        }
                    if (a.Jd || !c) {
                        if (A && t && a.length > 0) {
                            if (o = t.split(",")) {
                                o.push("100");
                                for (p = h = 0; p < o.length; p++)
                                    if (f = o[p] ? parseFloat("" + o[p]) : 0) {
                                        if (a.Q < f) j = p + 1, c = "M:" + h + "-" + f, p = o.length;
                                        h = f
                                    }
                            }
                        } else if (x && u && (o = u.split(","))) {
                            o.push("" + (a.length > 0 ? a.length : "E"));
                            for (p = h = 0; p < o.length; p++)
                                if ((f = o[p] ? parseFloat("" + o[p]) : 0) || o[p] == "E") {
                                    if (g < f || o[p] == "E") j = p + 1, c = "O:" + h + "-" + f, p = o.length;
                                    h = f
                                }
                        }
                        if (c) a.Jd = !0
                    }
                    if ((c || a.R) &&
                        c != a.R) {
                        a.lc = !0;
                        if (!a.R) a.Ea = j, a.R = c;
                        a.ca >= 0 && (y = !0)
                    }
                    if ((e >= 2 || a.Q >= 100) && a.P < g) a.Qd += g - a.P, a.V += g - a.P;
                    if (e <= 2 || e == 3 && !a.ua) a.gc += (e == 1 || e == 3 ? "S" : "E") + Math.floor(g), a.ua = e == 3 ? 1 : e;
                    if (!y && a.ca >= 0 && e <= 3 && (G = G ? G : 0) && a.V >= G) y = !0, l.mediaEvent = "SECONDS";
                    a.Zb = b;
                    a.P = g
                }
                if (!e || e <= 3 && a.Q >= 100) a.ua != 2 && (a.gc += "E" + Math.floor(g)), e = 0, D = C = "None", l.mediaEvent = "CLOSE";
                if (e == 7) y = l.clicked = a.Wb = !0;
                if (e == 5 || m.completeByCloseOffset && (!e || a.Q >= 100) && a.length > 0 && g >= a.length - m.completeCloseOffsetThreshold) y = l.complete = a.complete = !0;
                b = l.mediaEvent;
                b == "MILESTONE" ? b += "_" + l.milestone : b == "OFFSET_MILESTONE" && (b += "_" + l.offsetMilestone);
                a.Bd[b] ? l.eventFirstTime = !1 : (l.eventFirstTime = !0, a.Bd[b] = 1);
                l.event = l.mediaEvent;
                l.timePlayed = a.Qd;
                l.segmentNum = a.Ea;
                l.segment = a.R;
                l.segmentLength = a.Bb;
                m.monitor && e != 4 && m.monitor(m.s, l);
                if (m.Heartbeat && m.Heartbeat.enabled) {
                    l = [];
                    l.push(a.name);
                    if (!a.Fd) a.Fd = !0, l.push(a.length), l.push(a.playerName), a.ra ? (l.push(a.wb), l.push(a.ac), l.push(a.bc), l.push(a.xa), m.Heartbeat.callMethodWhenReady("openAd", l)) :
                        m.Heartbeat.callMethodWhenReady("open", l), l = [], l.push(a.name);
                    e == 0 ? m.Heartbeat.callMethodWhenReady("close", l) : (l.push(g), e == 1 ? (l.push(a.Ea), l.push(a.R), l.push(a.Bb), m.Heartbeat.callMethodWhenReady("play", l)) : e == 2 ? m.Heartbeat.callMethodWhenReady("stop", l) : e == 3 ? m.Heartbeat.callMethodWhenReady("monitor", l) : e == 5 ? m.Heartbeat.callMethodWhenReady("complete", l) : e == 7 && m.Heartbeat.callMethodWhenReady("click", l));
                    a.ca >= 0 && (y = !1)
                }
                e == 0 && m.De(d);
                if (y && a.kc == H) {
                    d = {};
                    d.contextData = {};
                    d.linkTrackVars = D;
                    d.linkTrackEvents =
                        C;
                    if (!d.linkTrackVars) d.linkTrackVars = "";
                    if (!d.linkTrackEvents) d.linkTrackEvents = "";
                    m.lf(d, a);
                    d.linkTrackVars || (d["!linkTrackVars"] = 1);
                    d.linkTrackEvents || (d["!linkTrackEvents"] = 1);
                    m.s.track(d);
                    if (a.lc) a.Ea = j, a.R = c, a.fc = !0, a.lc = !1;
                    else if (a.V > 0) a.fc = !1;
                    a.gc = "";
                    a.ub = a.vb = 0;
                    a.V -= Math.floor(a.V);
                    a.ca = g;
                    a.kc++
                }
            }
        }
        return a
    };
    m.hf = function (d, e, g, j, c) {
        var a = 0;
        if (d && (!m.autoTrackMediaLengthRequired || e && e > 0)) {
            if (!m.list || !m.list[d]) {
                if (g == 1 || g == 3) m.open(d, e, "HTML5 Video", c), a = 1
            } else a = 1;
            a && m.fa(d, g, j, -1, 0)
        }
    };
    m.attach = function (d) {
        var e, g, j;
        if (d && d.tagName && d.tagName.toUpperCase() == "VIDEO") {
            if (!m.$a) m.$a = function (c, a, b) {
                var f, h;
                if (m.autoTrack) {
                    f = c.currentSrc;
                    (h = c.duration) || (h = -1);
                    if (b < 0) b = c.currentTime;
                    m.hf(f, h, a, b, c)
                }
            };
            e = function () {
                m.$a(d, 1, -1)
            };
            g = function () {
                m.$a(d, 1, -1)
            };
            m.ma(d, "play", e);
            m.ma(d, "pause", g);
            m.ma(d, "seeking", g);
            m.ma(d, "seeked", e);
            m.ma(d, "ended", function () {
                m.$a(d, 0, -1)
            });
            m.ma(d, "timeupdate", e);
            j = function () {
                !d.paused && !d.ended && !d.seeking && m.$a(d, 3, -1);
                setTimeout(j, 1E3)
            };
            j()
        }
    };
    m.ma = function (m,
                     e, g) {
        m.attachEvent ? m.attachEvent("on" + e, g) : m.addEventListener && m.addEventListener(e, g, !1)
    };
    if (m.completeByCloseOffset == void 0) m.completeByCloseOffset = 1;
    if (m.completeCloseOffsetThreshold == void 0) m.completeCloseOffsetThreshold = 1;
    var E = new function (m) {
        this.xe = function (e) {
            this.s = e;
            this.enabled = !1;
            this.r = new this.Fa.yf.$d(e)
        };
        this.open = function (e, g, m) {
            this.r.open(e, g, m)
        };
        this.openAd = function (e, g, m, c, a, b, f) {
            this.r.openAd(e, g, m, c, a, b, f)
        };
        this.close = function (e) {
            this.r.close(e)
        };
        this.play = function (e, m, d, c,
                              a) {
            this.r.play(e, m, d, c, a)
        };
        this.monitor = function (e, m) {
            this.r.monitor(e, m)
        };
        this.stop = function (e, m) {
            this.r.stop(e, m)
        };
        this.click = function (e, m) {
            this.r.click(e, m)
        };
        this.complete = function (e, m) {
            this.r.complete(e, m)
        };
        this.setup = function (e) {
            this.r.Hf(e)
        };
        this.bufferStart = function () {
            this.r.kf()
        };
        this.bitrateChange = function (e) {
            this.r.jf(e)
        };
        this.updateQoSInfo = function (e, m, d) {
            this.r.Nf(e, m, d)
        };
        this.adBreakStart = function (m) {
            this.r.ef(m)
        };
        this.adBreakEnd = function () {
            this.r.df()
        };
        this.trackError = function (m, g, d) {
            this.r.Lf(m,
                g, d)
        };
        this.__setPsdkVersion = function (m) {
            this.r.ye(m)
        };
        (function (m) {
            if (typeof g === "undefined") var g = {};
            if (typeof d === "undefined") var d = {};
            d.event || (d.event = {});
            d.a || (d.a = {});
            d.C || (d.C = {});
            d.Wa || (d.Wa = {});
            d.I || (d.I = {});
            (function (c) {
                c.extend = function (a, b) {
                    function f() {
                        this.constructor = a
                    }
                    for (var h in b) b.hasOwnProperty(h) && (a[h] = b[h]);
                    f.prototype = b.prototype;
                    a.prototype = new f;
                    a.o = b.prototype;
                    return a
                }
            })(g);
            (function (c) {
                c.ea = function (a, b) {
                    var f = [],
                        h;
                    for (h in b) b.hasOwnProperty(h) && typeof b[h] === "function" &&
                    f.push(h);
                    for (h = 0; h < f.length; h++) {
                        var c = f[h];
                        a.prototype[c] = b[c]
                    }
                }
            })(g);
            (function (c) {
                c.vd = {
                    Ad: function () {
                        this.Z && this.Z.apply(this, arguments);
                        this.Z = i
                    }
                }
            })(g);
            (function (c) {
                c.da = {
                    Ua: function (a) {
                        this.Na = !0;
                        this.ob = a;
                        this.Na = !1
                    },
                    log: function (a) {
                        this.Na && window.console && window.console.log && window.console.log(this.ob + a)
                    },
                    info: function (a) {
                        this.Na && window.console && window.console.info && window.console.info(this.ob + a)
                    },
                    warn: function (a) {
                        this.Na && window.console && window.console.warn && window.console.warn(this.ob +
                            a)
                    },
                    error: function (a) {
                        if (this.Na && window.console && window.console.error) throw a = this.ob + a, window.console.error(a), Error(a);
                    }
                }
            })(g);
            (function (c) {
                function a(a, f) {
                    this.type = a;
                    this.data = f
                }
                a.Lb = "success";
                a.Ib = "error";
                c.T = a
            })(g);
            (function (c) {
                function a() {
                    this.B = {}
                }
                a.prototype.addEventListener = function (a, f, h) {
                    a && f && (this.B[a] = this.B[a] || [], this.B[a].push({
                        mf: f,
                        ud: h || window
                    }))
                };
                a.prototype.dispatchEvent = function (a) {
                    if (a.type)
                        for (var f in this.B)
                            if (this.B.hasOwnProperty(f) && a.type === f) {
                                var h = this.B[f];
                                for (f =
                                         0; f < h.length; f++) h[f].mf.call(h[f].ud, a);
                                break
                            }
                };
                a.prototype.Ya = function (a) {
                    if (a) {
                        var f, h;
                        for (h in this.B)
                            if (this.B.hasOwnProperty(h)) {
                                for (f = this.B[h].length - 1; f >= 0; f--) this.B[h][f].ud === a && this.B[h].splice(f, 1);
                                this.B[h].length || delete this.B[h]
                            }
                    } else this.B = {}
                };
                c.Oc = a
            })(g);
            (function (c) {
                function a() {
                    if (!a.prototype.Ma) a.prototype.Ma = new b;
                    return a.prototype.Ma
                }
                var b = c.Oc;
                c.W = a
            })(g);
            (function (c) {
                function a() {}

                function b() {
                    b.o.constructor.call(this)
                }
                var f = c.T,
                    h = c.Oc;
                a.Qc = "GET";
                c.extend(b, h);
                b.prototype.load =
                    function (a) {
                        if (a && a.method && a.url) {
                            var h = this;
                            a.qa.onreadystatechange = function () {
                                if (a.qa.readyState === 4) {
                                    var m = {};
                                    m[b.ie] = a.qa.status;
                                    a.qa.status === 200 ? (m[b.ee] = a.qa.responseText, h.dispatchEvent(new c.T(f.Lb, m))) : h.dispatchEvent(new c.T(f.Ib, m))
                                }
                            };
                            a.qa.open(a.method, a.url, !0);
                            a.qa.send()
                        }
                    };
                b.prototype.close = function () {
                    this.Ya()
                };
                b.ie = "status";
                b.ee = "response";
                c.we = a;
                c.ve = function (a) {
                    this.url = a || i;
                    this.method = i;
                    this.qa = new XMLHttpRequest
                };
                c.ue = b
            })(g);
            (function (c, a) {
                function b() {}
                b.ya = "report";
                b.la =
                    "what";
                b.oc = "account";
                b.Xc = "sc_tracking_server";
                b.cd = "tracking_server";
                b.Ec = "check_status_server";
                b.Rc = "job_id";
                b.mb = "publisher";
                b.Zc = "stream_type";
                b.Tc = "ovp";
                b.Yc = "sdk";
                b.Cc = "channel";
                b.Gc = "debug_tracking";
                b.overlayIframe = "track_local";
                b.nb = "visitor_id";
                b.bb = "analytics_visitor_id";
                b.ib = "marketing_cloud_visitor_id";
                b.z = "name";
                b.hb = "length";
                b.lb = "player_name";
                b.X = "timer_interval";
                b.bd = "tracking_interval";
                b.Dc = "check_status_interval";
                b.Mb = "track_external_errors";
                b.Uc = "parent_name";
                b.Vc = "parent_pod";
                b.Wc = "parent_pod_position";
                b.Jb = "parent_pod_offset";
                b.xa = "parent_pod_cpm";
                b.N = "offset";
                b.Kb = "source";
                b.Jc = "error_id";
                b.eb = "bitrate";
                b.Pc = "fps";
                b.Hc = "dropped_frames";
                a.event.ja = b
            })(g, d);
            (function (c, a) {
                function b(a, h) {
                    b.o.constructor.call(this, a, h)
                }
                c.extend(b, c.T);
                b.Ga = "api_destroy";
                b.Pf = "api_init";
                b.Fb = "api_config";
                b.wc = "api_open_main";
                b.vc = "api_open_ad";
                b.sc = "api_close";
                b.xc = "api_play";
                b.uc = "api_monitor";
                b.zc = "api_stop";
                b.rc = "api_click";
                b.tc = "api_complete";
                b.Ac = "api_track_error";
                b.yc = "api_qos_info";
                b.pc = "api_bitrate_change";
                b.qc = "api_buffer_start";
                b.Gb = "api_pod_offset";
                a.event.Ha = b
            })(g, d);
            (function (c, a) {
                function b(a, h) {
                    b.o.constructor.call(this, a, h)
                }
                c.extend(b, c.T);
                b.wa = "context_data_available";
                a.event.Fc = b
            })(g, d);
            (function (c, a) {
                function b(a, h) {
                    b.o.constructor.call(this, a, h)
                }
                c.extend(b, c.T);
                b.ha = "data_request";
                b.fb = "data_response";
                b.ta = {
                    Ia: "tracking_timer_interval",
                    Sc: "main_video_publisher"
                };
                a.event.Hb = b
            })(g, d);
            (function (c, a) {
                function b(a, h) {
                    b.o.constructor.call(this, a, h)
                }
                c.extend(b, c.T);
                b.jb = "network_check_status_complete";
                a.event.kb = b
            })(g, d);
            (function (c, a) {
                function b(a, h) {
                    b.o.constructor.call(this, a, h)
                }
                c.extend(b, c.T);
                b.TIMER_TRACKING_TICK = "TIMER_TRACKING_TICK";
                b.TIMER_TRACKING_ENABLE = "TIMER_TRACKING_ENABLE";
                b.TIMER_TRACKING_DISABLE = "TIMER_TRACKING_DISABLE";
                b.TIMER_CHECK_STATUS_TICK = "TIMER_CHECK_STATUS_TICK";
                b.TIMER_CHECK_STATUS_ENABLE = "TIMER_CHECK_STATUS_ENABLE";
                b.TIMER_CHECK_STATUS_DISABLE = "TIMER_CHECK_STATUS_DISABLE";
                a.event.Ja = b
            })(g, d);
            (function (c, a) {
                function b(a, b) {
                    this.value = a;
                    this.hint = b
                }

                function f(a) {
                    this.ec =
                        a;
                    this.data = {}
                }
                b.ka = "short";
                f.prototype.c = function (a, b, f) {
                    var c = this;
                    return function () {
                        arguments.length && (c[a] = arguments[0], c.Od(b, arguments[0], f));
                        return c[a]
                    }
                };
                f.prototype.Od = function (a, f, c) {
                    this.data[a] = new b(f, c)
                };
                a.a.K = f;
                a.a.Ic = b
            })(g, d);
            (function (c, a) {
                function b(a, c) {
                    b.o.constructor.call(this, a);
                    this.Of = this.c("_year", "year", f.ka);
                    this.Af = this.c("_month", "month", f.ka);
                    this.pf = this.c("_day", "day", f.ka);
                    this.vf = this.c("_hour", "hour", f.ka);
                    this.zf = this.c("_minute", "minute", f.ka);
                    this.Ef = this.c("_second",
                        "second", f.ka);
                    this.Of(c.getUTCFullYear());
                    this.Af(c.getUTCMonth() + 1);
                    this.pf(c.getUTCDate());
                    this.vf(c.getUTCHours());
                    this.zf(c.getUTCMinutes());
                    this.Ef(c.getUTCSeconds())
                }
                var f = a.a.Ic;
                c.extend(b, a.a.K);
                a.a.Wd = b
            })(g, d);
            (function (c, a) {
                function b() {
                    b.o.constructor.call(this, "asset");
                    this.sb = this.c("_cpm", "cpm", i);
                    this.H = this.c("_adId", "ad_id", i);
                    this.Ab = this.c("_resolver", "resolver", i);
                    this.xb = this.c("_podId", "pod_id", i);
                    this.yb = this.c("_podPosition", "pod_position", i);
                    this.zb = this.c("_podSecond", "pod_second",
                        i);
                    this.length = this.c("_length", "length", i);
                    this.sb("");
                    this.H("");
                    this.Ab("");
                    this.xb("");
                    this.yb("");
                    this.zb(0);
                    this.length(0);
                    if (arguments.length && arguments[0] instanceof b) {
                        var a = arguments[0];
                        this.sb(a.sb());
                        this.H(a.H());
                        this.Ab(a.Ab());
                        this.xb(a.xb());
                        this.yb(a.yb());
                        this.zb(a.zb());
                        this.length(a.length())
                    }
                }
                c.extend(b, a.a.K);
                a.a.Bc = b
            })(g, d);
            (function (c, a) {
                function b() {
                    b.o.constructor.call(this, "asset");
                    this.type = this.c("_type", "type", i);
                    this.i = this.c("_videoId", "video_id", i);
                    this.M = this.c("_publisher",
                        "publisher", i);
                    this.n = this.c("_adData", "ad_data", i);
                    this.duration = this.c("_duration", "duration", i);
                    this.type("");
                    this.i("");
                    this.M("");
                    this.n(i);
                    this.duration(0);
                    if (arguments.length && arguments[0] instanceof b) {
                        var a = arguments[0];
                        this.type(a.type());
                        this.i(a.i());
                        this.M(a.M());
                        this.duration(a.duration());
                        (a = a.n()) && this.n(new f(a))
                    }
                }
                var f = a.a.Bc;
                c.extend(b, a.a.K);
                b.ed = "vod";
                b.qe = "live";
                b.oe = "linear";
                b.za = "ad";
                a.a.cb = b
            })(g, d);
            (function (c, a) {
                function b(a) {
                    b.o.constructor.call(this, "event");
                    this.bf = a;
                    this.type = this.c("_type", "type", i);
                    this.count = this.c("_count", "count", i);
                    this.ic = this.c("_totalCount", "total_count", i);
                    this.duration = this.c("_duration", "duration", i);
                    this.jc = this.c("_totalDuration", "total_duration", i);
                    this.va = this.c("_playhead", "playhead", i);
                    this.id = this.c("_id", "id", i);
                    this.source = this.c("_source", "source", i);
                    this.cc = this.c("_prevTs", "prev_ts", i);
                    this.Mf = this.c("_tsAsDate", "ts_as_date", i);
                    this.cf = function () {
                        var a = this.bf * 1E3;
                        this.Mf(new f(this.ec, new Date(Math.floor(this.Tb / a) * a)))
                    };
                    this.Db = function () {
                        if (arguments.length) this.Tb = arguments[0], this.Od("ts", this.Tb, i), this.cf();
                        return this.Tb
                    };
                    this.type("");
                    this.count(0);
                    this.ic(0);
                    this.duration(0);
                    this.jc(0);
                    this.va(0);
                    this.id("");
                    this.source("");
                    this.cc(-1);
                    this.Db((new Date).getTime())
                }
                var f = a.a.Wd;
                c.extend(b, a.a.K);
                b.ia = "start";
                b.Nc = "play";
                b.Mc = "pause";
                b.Yd = "buffer";
                b.Xd = "bitrate_change";
                b.Zd = "error";
                b.Kc = "active";
                b.Lc = "complete";
                a.a.gb = b
            })(g, d);
            (function (c, a) {
                function b() {
                    b.o.constructor.call(this, "stream");
                    this.Ub = this.c("_bitrate",
                        "bitrate", i);
                    this.Cd = this.c("_fps", "fps", i);
                    this.yd = this.c("_droppedFrames", "dropped_frames", i);
                    this.Ub(0);
                    this.Cd(0);
                    this.yd(0)
                }
                c.extend(b, a.a.K);
                a.a.ce = b
            })(g, d);
            (function (c, a) {
                function b() {
                    b.o.constructor.call(this, "sc");
                    this.Za = this.c("_sessionId", "rsid", i);
                    this.trackingServer = this.c("_trackingServer", "tracking_server", i);
                    this.Za("");
                    this.trackingServer("")
                }
                c.extend(b, a.a.K);
                a.a.ne = b
            })(g, d);
            (function (c, a) {
                function b() {
                    b.o.constructor.call(this, "sp");
                    this.Ca = this.c("_ovp", "ovp", i);
                    this.Da = this.c("_sdk",
                        "sdk", i);
                    this.channel = this.c("_channel", "channel", i);
                    this.playerName = this.c("_playerName", "player_name", i);
                    this.Ca("unknown");
                    this.Da("unknown");
                    this.channel("unknown");
                    this.playerName("")
                }
                c.extend(b, a.a.K);
                a.a.ke = b
            })(g, d);
            (function (c, a) {
                function b() {
                    b.o.constructor.call(this, "event");
                    this.Za = this.c("_sessionId", "sid", i);
                    this.Za("")
                }
                c.extend(b, a.a.K);
                a.a.le = b
            })(g, d);
            (function (c, a) {
                function b() {
                    b.o.constructor.call(this, "stream");
                    this.Vb = this.c("_cdn", "cdn", i);
                    this.name = this.c("_name", "name", i);
                    this.Vb("");
                    this.name("");
                    if (arguments.length && arguments[0] instanceof b) {
                        var a = arguments[0];
                        this.Vb(a.Vb());
                        this.name(a.name())
                    }
                }
                c.extend(b, a.a.K);
                a.a.$c = b
            })(g, d);
            (function (c, a) {
                function b() {
                    b.o.constructor.call(this, "user");
                    this.Yb = this.c("_device", "device", i);
                    this.country = this.c("_country", "country", i);
                    this.city = this.c("_city", "city", i);
                    this.latitude = this.c("_latitude", "latitude", i);
                    this.longitude = this.c("_longitude", "longitude", i);
                    this.ab = this.c("_visitorId", "id", i);
                    this.Ta = this.c("_analyticsVisitorId", "aid",
                        i);
                    this.Va = this.c("_marketingCloudVisitorId", "mid", i);
                    this.Yb("");
                    this.country("");
                    this.city("");
                    this.latitude("");
                    this.longitude("");
                    this.ab("");
                    this.Ta("");
                    this.Va("");
                    if (arguments.length && arguments[0] instanceof b) {
                        var a = arguments[0];
                        this.Yb(a.Yb());
                        this.country(a.country());
                        this.city(a.city());
                        this.latitude(a.latitude());
                        this.longitude(a.longitude());
                        this.ab(a.ab());
                        this.Ta(a.Ta());
                        this.Va(a.Va())
                    }
                }
                c.extend(b, a.a.K);
                a.a.hd = b
            })(g, d);
            (function (c, a) {
                a.a.ge = function (a, c, h, m, d) {
                    this.ba = a;
                    this.f = c;
                    this.mc =
                        h;
                    this.hc = m;
                    this.Xa = d
                }
            })(g, d);
            (function (c, a) {
                var b = a.a.gb;
                a.a.fe = function (a, h, c) {
                    this.If = a;
                    this.Ff = h;
                    this.Gf = c;
                    this.F = [];
                    this.Sa = function (a) {
                        this.F.push(a)
                    };
                    this.Wf = function () {
                        return this.F
                    };
                    this.rf = function () {
                        if (this.F.length)
                            for (var a = this.F.length - 1; a >= 0; a--) this.F[a].ba.type() === b.Mc && this.F.splice(a, 1)
                    }
                }
            })(g, d);
            (function (c, a) {
                function b() {}
                b.prototype.Ld = F();
                b.prototype.Md = F();
                b.prototype.S = F();
                b.prototype.Kd = F();
                b.prototype.Nd = F();
                a.a.je = b
            })(g, d);
            (function (c, a) {
                function b() {
                    this.Ua("[QuerystringSerializer] > ");
                    this.Y = function (a) {
                        return a ? a + "&" : ""
                    };
                    this.pd = function (a) {
                        return a.substring(0, a.length - 1)
                    };
                    this.Ze = function (a) {
                        var b = [],
                            c;
                        for (c in a.data)
                            if (a.data.hasOwnProperty(c)) {
                                var h = a.data[c],
                                    f = h.value;
                                h = h.hint;
                                var d = i;
                                f === i || typeof f === "undefined" || (typeof f === "number" ? d = this.Kd(c, f, a.ec, h) : typeof f === "string" ? d = this.Nd(c, f, a.ec, h) : f instanceof m ? d = this.S(f) : this.warn("Unable to serialize DAO. Field: " + c + ". Value: " + f + "."), d && b.push(d))
                            }
                        return b
                    }
                }
                var f = c.ea,
                    h = c.da,
                    m = a.a.K,
                    d = a.a.Ic;
                c.extend(b, a.a.je);
                f(b,
                    h);
                b.prototype.Ld = function (a) {
                    for (var b = [], c = a.F, h = 0; h < c.length; h++) {
                        var f = this.Md(c[h]) + "&";
                        f += this.Y(this.S(a.If));
                        f += this.Y(this.S(a.Ff));
                        f += this.Y(this.S(a.Gf));
                        f = this.pd(f);
                        b.push(f)
                    }
                    return b
                };
                b.prototype.Md = function (a) {
                    var b = this.Y(this.S(a.ba));
                    b += this.Y(this.S(a.f));
                    b += this.Y(this.S(a.mc));
                    b += this.Y(this.S(a.hc));
                    b += this.Y(this.S(a.Xa));
                    return b = this.pd(b)
                };
                b.prototype.S = function (a) {
                    a = this.Ze(a);
                    for (var b = "", c = 0; c < a.length; c++) b += c == a.length - 1 ? a[c] : a[c] + "&";
                    return b
                };
                b.prototype.Kd = function (a,
                                           b, c, h) {
                    var f = "l";
                    if (b != i && b !== void 0 && !isNaN(b)) return h && typeof h === "string" && h === d.ka && (f = "h"), f + ":" + c + ":" + a + "=" + b;
                    return i
                };
                b.prototype.Nd = function (a, b, c) {
                    if (b) return "s:" + c + ":" + a + "=" + b;
                    return i
                };
                a.a.de = b
            })(g, d);
            (function (c, a) {
                function b(a) {
                    this.Pd = 0;
                    this.J = a;
                    this.tb = !1
                }

                function f() {
                    if (f.prototype.Ma) return f.prototype.Ma;
                    var a = this;
                    this.Be = 0;
                    this.aa = {};
                    this.na = function () {
                        clearInterval(this.ld);
                        g().Ya(this)
                    };
                    this.Ue = function () {
                        this.Be++;
                        for (var a in this.aa)
                            if (this.aa.hasOwnProperty(a)) {
                                var b = this.aa[a];
                                if (b.tb && (b.Pd++, b.Pd % b.J === 0)) {
                                    var c = {};
                                    c[e.X] = b.J;
                                    g().dispatchEvent(new d(d[a], c))
                                }
                            }
                    };
                    g().addEventListener(m.Ga, this.na, this);
                    this.ld = setInterval(function () {
                        a.Ue()
                    }, u * 1E3);
                    this.wf = function (a) {
                        return (a = this.aa[a]) && a.tb
                    };
                    this.td = function (a, c) {
                        this.aa[a] = new b(c)
                    };
                    this.qf = function (a) {
                        delete this.aa[a]
                    };
                    this.Jf = function (a) {
                        if (a = this.aa[a]) a.tb = !0
                    };
                    this.Kf = function (a) {
                        if (a = this.aa[a]) a.tb = !1
                    };
                    f.prototype.Ma = this
                }
                var h = c.ea,
                    m = a.event.Ha,
                    d = a.event.Ja,
                    e = a.event.ja,
                    g = c.W,
                    u = 1;
                h(f, c.da);
                new f;
                a.I.se = f
            })(g,
                d);
            (function (c, a) {
                function b(a, b, c, f) {
                    this.Ua("[Timer] > ");
                    this.J = f;
                    this.ga = a;
                    this.zd = b;
                    this.xd = c;
                    d().td(this.ga, this.J);
                    this.na = function () {
                        this.wd()
                    };
                    this.Xe = function () {
                        this.start()
                    };
                    this.We = function () {
                        this.stop()
                    };
                    h().addEventListener(m.Ga, this.na, this);
                    this.zd && h().addEventListener(this.zd, this.Xe, this);
                    this.xd && h().addEventListener(this.xd, this.We, this)
                }
                var f = c.ea,
                    h = c.W,
                    m = a.event.Ha,
                    d = a.I.se;
                f(b, c.da);
                b.prototype.start = function () {
                    this.info("Starting timer: " + this.ga);
                    d().Jf(this.ga)
                };
                b.prototype.stop =
                    function () {
                        this.info("Stopping timer: " + this.ga);
                        d().Kf(this.ga)
                    };
                b.prototype.wd = function () {
                    h().Ya(this);
                    d().qf(this.ga)
                };
                b.prototype.setInterval = function (a) {
                    var b = d().wf(this.ga);
                    this.stop();
                    this.J = a;
                    d().td(this.ga, this.J);
                    b && this.start()
                };
                a.I.gd = b
            })(g, d);
            (function (c, a) {
                function b() {
                    b.o.constructor.call(this, d.TIMER_TRACKING_TICK, d.TIMER_TRACKING_ENABLE, d.TIMER_TRACKING_DISABLE, g);
                    this.Oa = function (a) {
                        (a = a.data[e.bd]) ? a !== this.J && this.setInterval(a) : this.setInterval(g)
                    };
                    this.Pb = function (a) {
                        switch (a.data[e.la]) {
                            case h.ta.Ia:
                                a = {}, a[e.X] = this.J, f().dispatchEvent(new h(h.fb, a))
                        }
                    };
                    f().addEventListener(m.jb, this.Oa, this);
                    f().addEventListener(h.ha, this.Pb, this)
                }
                var f = c.W,
                    h = a.event.Hb,
                    m = a.event.kb,
                    d = a.event.Ja,
                    e = a.event.ja,
                    g = 10;
                c.extend(b, a.I.gd);
                a.I.te = b
            })(g, d);
            (function (c, a) {
                function b() {
                    b.o.constructor.call(this, g.TIMER_CHECK_STATUS_TICK, g.TIMER_CHECK_STATUS_ENABLE, g.TIMER_CHECK_STATUS_DISABLE, h);
                    var a = this;
                    setTimeout(function () {
                        a.Fe()
                    }, 200);
                    this.Fe = function () {
                        var a = {};
                        a[e.X] = this.J;
                        m().dispatchEvent(new g(g.TIMER_CHECK_STATUS_TICK,
                            a))
                    };
                    this.Oa = function (a) {
                        (a = a.data[e.Dc]) ? a !== this.J && (a > f ? this.setInterval(f) : this.setInterval(a)) : this.setInterval(h)
                    };
                    m().addEventListener(d.jb, this.Oa, this)
                }
                var f = 600,
                    h = 60,
                    m = c.W,
                    d = a.event.kb,
                    e = a.event.ja,
                    g = a.event.Ja;
                c.extend(b, a.I.gd);
                a.I.Sd = b
            })(g, d);
            (function (c, a) {
                var b = a.I.Sd,
                    f = a.I.te;
                a.I.Td = function () {
                    this.Rf = new b;
                    this.Uf = new f
                }
            })(g, d);
            (function (c, a) {
                function b(a) {
                    this.Ce = a
                }
                var f = c.W,
                    h = a.event.ja,
                    m = a.event.kb;
                b.prototype.parse = function () {
                    var a = i,
                        b = i,
                        c = i,
                        d;
                    window.Qf ? d = (new DOMParser).parseFromString(this.Ce,
                        "text/xml") : (d = new ActiveXObject("Microsoft.XMLDOM"), d.async = !1, d.loadXML(this.data));
                    var e;
                    (e = parseInt(d.getElementsByTagName("trackingInterval")[0].childNodes[0].nodeValue, 10)) && (a = e);
                    (e = parseInt(d.getElementsByTagName("setupCheckInterval")[0].childNodes[0].nodeValue, 10)) && (b = e);
                    (e = parseInt(d.getElementsByTagName("trackExternalErrors")[0].childNodes[0].nodeValue, 10)) && (c = e === 1);
                    d = {};
                    d[h.bd] = a;
                    d[h.Dc] = b;
                    d[h.Mb] = c;
                    f().dispatchEvent(new m(m.jb, d))
                };
                a.Wa.me = b
            })(g, d);
            (function (c, a) {
                function b(a) {
                    this.Ua("[Network] > ");
                    this.Aa = this.qd = this.md = !1;
                    this.af = a;
                    this.od = this.kd = this.rd = i;
                    this.Ob = function (a) {
                        a = a.data;
                        this.rd = a[x.cd];
                        this.kd = a[x.Ec];
                        this.od = a[x.Rc];
                        this.md = a[x.Gc];
                        this.qd = a[x.overlayIframe];
                        this.Aa = !0
                    };
                    this.na = function () {
                        m().Ya(this)
                    };
                    this.Se = function (a) {
                        function b() {
                            h.close()
                        }

                        function c(a) {
                            e.log("Failed to send heartbeat report: " + JSON.stringify(a));
                            h.close()
                        }
                        if (this.Aa) {
                            a = this.af.Ld(a.data[x.ya]);
                            var h;
                            if (!this.qd)
                                for (var f = 0; f < a.length; f++) {
                                    var m = new j(this.rd + "/?__job_id=" + this.od + "&" + a[f]);
                                    m.method = g.Qc;
                                    this.md &&
                                    this.log(m.method + " : " + m.url);
                                    h = new A;
                                    h.addEventListener(d.Lb, b, this);
                                    h.addEventListener(d.Ib, c, this);
                                    h.load(m)
                                }
                            var e = this
                        }
                    };
                    this.Ve = function () {
                        this.Z = function (a) {
                            if (a = a[x.mb]) {
                                a = a.replace(/[^a-zA-Z0-9]+/, "-").toLocaleLowerCase();
                                a = new j(this.kd + a + ".xml?r=" + (new Date).getTime());
                                a.method = g.Qc;
                                var b = new A;
                                b.addEventListener(d.Lb, function (a) {
                                    a.data && (new l(a.data.response)).parse();
                                    b.close()
                                }, this);
                                b.addEventListener(d.Ib, function (a) {
                                    c.log("Failed to obtain the config. settings: " + JSON.stringify(a));
                                    b.close()
                                }, this);
                                this.info("Get new settings from: " + a.url);
                                b.load(a);
                                var c = this
                            }
                        };
                        var a = {};
                        a[x.la] = o.ta.Sc;
                        m().dispatchEvent(new o(o.ha, a))
                    };
                    this.Qb = function (a) {
                        this.Ad(a.data)
                    };
                    m().addEventListener(o.fb, this.Qb, this);
                    m().addEventListener(e.Fb, this.Ob, this);
                    m().addEventListener(e.Ga, this.na, this);
                    m().addEventListener(y.wa, this.Se, this);
                    m().addEventListener(p.TIMER_CHECK_STATUS_TICK, this.Ve, this)
                }
                var f = c.ea,
                    h = c.da,
                    d = c.T,
                    m = c.W,
                    e = a.event.Ha,
                    g = c.we,
                    j = c.ve,
                    A = c.ue,
                    x = a.event.ja,
                    o = a.event.Hb,
                    p = a.event.Ja,
                    y = a.event.Fc,
                    l = a.Wa.me;
                f(b, c.vd);
                f(b, h);
                a.Wa.be = b
            })(g, d);
            (function (c, a) {
                a.C.Vd = function () {
                    this.oa = {};
                    this.pa = {};
                    this.Tf = {};
                    this.Dd = function (a, c, h) {
                        a = c + "." + h + "." + a;
                        this.oa[a] || (this.oa[a] = 0);
                        return this.oa[a]
                    };
                    this.Cf = function (a, c, h) {
                        this.oa[c + "." + h + "." + a] = 0
                    };
                    this.Hd = function (a, c, h) {
                        a = c + "." + h + "." + a;
                        this.oa[a] || (this.oa[a] = 0);
                        this.oa[a]++
                    };
                    this.Ed = function (a, c, h) {
                        a = c + "." + h + "." + a;
                        this.pa[a] || (this.pa[a] = 0);
                        return this.pa[a]
                    };
                    this.Df = function (a, c, h) {
                        this.pa[c + "." + h + "." + a] = 0
                    };
                    this.Gd = function (a, c, h, m) {
                        a =
                            c + "." + h + "." + a;
                        this.pa[a] || (this.pa[a] = 0);
                        this.pa[a] += m
                    }
                }
            })(g, d);
            (function (c, a) {
                function b() {
                    this.nd = {};
                    this.Eb = function (a) {
                        var b = a.f;
                        b = (b.n() ? b.n().H() : b.i()) + "." + b.type() + "." + a.O;
                        this.info("Inserting key: " + b);
                        this.nd[b] = a
                    };
                    this.L = function (a) {
                        var b = a.f;
                        a = (b.n() ? b.n().H() : b.i()) + "." + b.type() + "." + a.O;
                        this.info("Requesting key: " + a);
                        return this.nd[a]
                    }
                }
                var f = c.ea;
                f(b, c.da);
                a.C.ae = b
            })(g, d);
            (function (c, a) {
                var b = a.a.gb,
                    f = a.a.cb,
                    h = a.a.hd,
                    m = a.a.$c;
                a.C.fd = function (a, c, d, e, g, x) {
                    this.timestamp = new Date;
                    this.f =
                        new f(a);
                    this.mc = new h(c);
                    this.hc = new m(d);
                    this.O = g;
                    this.Xa = e;
                    this.va = x;
                    this.A = void 0;
                    this.sf = function () {
                        if (this.O === b.Kc) return this.f.i();
                        return this.f.type() === f.za ? this.f.n().H() : this.f.i()
                    };
                    this.tf = function () {
                        return this.O === b.ia && this.f.type() !== f.za ? 0 : 1
                    }
                }
            })(g, d);
            (function (c, a) {
                a.C.re = function () {
                    this.U = [];
                    this.uf = function () {
                        return this.U.slice()
                    };
                    this.ff = function (a) {
                        for (var c = -1, h = this.U.length - 1; h >= 0; h--) {
                            if (a.timestamp >= this.U[h].timestamp) break;
                            c = h
                        }
                        c > 0 ? this.U.splice(h, 0, a) : this.U.push(a)
                    }
                }
            })(g,
                d);
            (function (c, a) {
                function b(a) {
                    this.Ua("[ReporterHelper] > ");
                    this.j = a;
                    this.Ka = function (a, b, c) {
                        var h = this.j.La,
                            m = a.O,
                            f = a.sf(),
                            e = a.f.type(),
                            j = m === d.ia ? 0 : a.va;
                        h.Hd(m, f, e);
                        h.Gd(m, f, e, b);
                        c = new d(c);
                        c.type(m);
                        c.count(a.tf());
                        c.duration(b);
                        c.ic(h.Dd(m, f, e));
                        c.jc(h.Ed(m, f, e));
                        c.va(j);
                        c.Db(a.timestamp.getTime());
                        c.cc(a.A ? a.A.timestamp.getTime() : -1);
                        return new g(c, a.f, a.mc, a.hc, a.Xa)
                    };
                    this.jd = function (a, b) {
                        if (a.F.length) {
                            var c = new e(this.j.e);
                            c.type(this.j.pb);
                            c.n(i);
                            c = new j(c, this.j.p, this.j.G, this.j.v,
                                d.Kc, this.j.m[this.j.e.i()]);
                            c.A = this.j.u.L(c);
                            this.j.u.Eb(c);
                            a.Sa(this.Ka(c, b * 1E3, b))
                        }
                    };
                    this.Qa = function (a, b) {
                        return b.getTime() - a.getTime()
                    };
                    this.Xb = function (a, b, c) {
                        var m = new h(this.j.rb, this.j.Ba, this.j.qb);
                        m.Sa(this.Ka(a, 0, b));
                        c && this.jd(m, b);
                        return m
                    };
                    this.sd = function (a, b, c) {
                        var m, f = new h(this.j.rb, this.j.Ba, this.j.qb),
                            g = this.j.U.uf(),
                            j = [],
                            r = i,
                            n = 0;
                        for (n = m = 0; n < g.length; n++) m = g[n], m.timestamp > a && m.timestamp <= b && j.push(m), m.timestamp < a && (r = m);
                        this.info("-------------TRACK REPORT----------------");
                        this.info("Interval: [" + a.getTime() + " , " + b.getTime() + "]. Tracking interval: " + c);
                        this.info("-----------------------------------------");
                        for (n = 0; n < g.length; n++) this.info("[" + g[n].timestamp.getTime() + "] :" + g[n].O + " | " + g[n].f.type());
                        this.info("-----------------------------------------");
                        for (n = 0; n < j.length; n++) this.info("[" + j[n].timestamp.getTime() + "] :" + j[n].O + " | " + j[n].f.type());
                        this.info("-----------------------------------------");
                        if (r) {
                            if (r.A) r.A.timestamp = r.timestamp;
                            r.timestamp = j.length ? new Date(j[0].timestamp.getTime() -
                                1) : new Date(b.getTime() - 1);
                            m = r.f.n() ? r.f.n().H() : r.f.i();
                            r.va = this.j.m[m]
                        }
                        if (j.length) {
                            g = 0;
                            r && (g = r.O === d.ia && r.f !== e.za ? this.Qa(r.timestamp, j[0].timestamp) : this.Qa(a, j[0].timestamp), f.Sa(this.Ka(r, g, c)));
                            for (n = 0; n < j.length; n++) {
                                a = j[n];
                                g = n == j.length - 1 ? this.Qa(a.timestamp, b) : this.Qa(a.timestamp, j[n + 1].timestamp);
                                r = !1;
                                var t = f.F;
                                for (m = 0; m < t.length; m++) {
                                    var q = t[m];
                                    a.f.type() === q.f.type() && a.O === q.ba.type() && (r = a.f.type() === e.za ? q.f.n().H() === a.f.n().H() : q.f.i() === a.f.i());
                                    if (r) {
                                        t = q.ba;
                                        var v = q.f.type();
                                        m = q.f.n() ? q.f.n().H() : q.f.i();
                                        var u = this.j.La;
                                        u.Hd(t.type(), m, v);
                                        u.Gd(t.type(), m, v, g);
                                        q.Xa = a.Xa;
                                        t.va(this.j.m[m]);
                                        t.duration(t.duration() + g);
                                        t.ic(u.Dd(t.type(), m, v));
                                        t.jc(u.Ed(t.type(), m, v));
                                        t.Db(a.timestamp.getTime());
                                        break
                                    }
                                }
                                if (!r) this.info("Adding event to report: " + a.O), m = a.f.n() ? a.f.n().H() : a.f.i(), a.va = this.j.m[m], f.Sa(this.Ka(a, g, c))
                            }
                        } else r && f.Sa(this.Ka(r, this.Qa(a, b), c));
                        f.rf();
                        this.jd(f, c);
                        for (n = 0; n < f.F.length; n++) b = f.F[n].ba, this.info("[" + b.Db() + "/" + b.cc() + "] :" + b.type());
                        return f
                    }
                }
                var m =
                        c.ea,
                    h = a.a.fe,
                    d = a.a.gb,
                    e = a.a.cb,
                    g = a.a.ge,
                    j = a.C.fd;
                m(b, c.da);
                a.C.he = b
            })(g, d);
            (function (c, a) {
                function b() {
                    this.Ua("[Context] > ");
                    this.l = !1;
                    this.pb = i;
                    this.Nb = !1;
                    this.k = this.Rb = i;
                    this.g = {
                        Cb: i,
                        M: i
                    };
                    this.Ra = this.Z = i;
                    this.m = {};
                    this.Pa = new e(this);
                    this.U = new g;
                    this.u = new u;
                    this.qb = new A;
                    this.rb = new x;
                    this.Ba = new p;
                    this.e = new o;
                    this.p = new y;
                    this.G = new l;
                    this.v = new w;
                    this.La = new r;
                    this.Ob = function (a) {
                        this.info("Call detected: onApiConfig().");
                        a = a.data;
                        this.rb.Za(a[k.oc]);
                        this.rb.trackingServer(a[k.Xc]);
                        this.g.M =
                            a[k.mb];
                        this.Ba.Ca(a[k.Tc]);
                        this.Ba.Da(a[k.Yc]);
                        this.Ba.channel(a[k.Cc]);
                        d().dispatchEvent(new n(n.TIMER_CHECK_STATUS_ENABLE))
                    };
                    this.na = function () {
                        d().Ya(this)
                    };
                    this.Me = function (a) {
                        this.info("Call detected: onApiOpenMain().");
                        a = a.data;
                        this.$e();
                        this.k = a[k.z];
                        this.m[this.k] = 0;
                        this.Ba.playerName(a[k.lb]);
                        this.p.ab(a[k.nb]);
                        this.p.Ta(a[k.bb]);
                        this.p.Va(a[k.ib]);
                        this.e.i(this.k);
                        this.e.duration(a[k.hb]);
                        this.pb = this.e.type(a[k.Zc]);
                        this.G.name(a[k.z]);
                        this.Ee();
                        d().dispatchEvent(new n(n.TIMER_TRACKING_ENABLE));
                        var b = new j(this.e, this.p, this.G, this.v, z.ia, 0);
                        b.A = this.u.L(b);
                        this.$(b);
                        this.Z = function (a) {
                            a = this.Pa.Xb(b, a[k.X], !0);
                            a.F[0].ba.count(1);
                            this.La.Cf(z.ia, this.e.i(), this.e.type());
                            this.La.Df(z.ia, this.e.i(), this.e.type());
                            var c = {};
                            c[k.ya] = a;
                            d().dispatchEvent(new B(B.wa, c))
                        };
                        a = {};
                        a[k.la] = q.ta.Ia;
                        d().dispatchEvent(new q(q.ha, a));
                        this.l = !0
                    };
                    this.Le = function (a) {
                        if (this.l) {
                            if (this.info("Call detected: onApiOpenAd()."), this.l) {
                                a = a.data;
                                this.e.i() || this.e.i(a[k.Uc]);
                                this.k = a[k.z];
                                this.m[this.k] = 0;
                                var b =
                                    new s;
                                b.H(this.k);
                                b.length(a[k.hb]);
                                b.Ab(a[k.lb]);
                                b.sb(a[k.xa]);
                                b.xb(a[k.Vc]);
                                b.zb(this.Rb);
                                b.yb(a[k.Wc] + "");
                                this.e.n(b);
                                this.e.type(o.za);
                                a = new j(this.e, this.p, this.G, this.v, z.ia, 0);
                                a.A = this.u.L(a);
                                this.$(a);
                                a = new j(this.e, this.p, this.G, this.v, z.Nc, this.m[this.k]);
                                a.A = this.u.L(a);
                                this.$(a)
                            }
                        } else this.warn("Call detected: onApiOpenAd() for inactive viewing session.")
                    };
                    this.Je = function (a) {
                        this.l ? (this.info("Call detected: onApiClose()."), this.l || this.warn("Call detected: onApiClose() for inactive viewing session."),
                            a.data[k.z] === this.e.i() ? this.Ae() : this.ze()) : this.warn("Call detected: onApiClose() for inactive viewing session.")
                    };
                    this.Ne = function (a) {
                        this.l ? (this.info("Call detected: onApiPlay()."), a = a.data, this.p.ab(a[k.nb]), this.p.Ta(a[k.bb]), this.p.Va(a[k.ib]), this.k = a[k.z], this.m[this.k] = Math.floor(a[k.N]), d().dispatchEvent(new n(n.TIMER_TRACKING_ENABLE)), a = new j(this.e, this.p, this.G, this.v, z.Nc, this.m[this.k]), a.A = this.u.L(a), this.$(a)) : this.warn("Call detected: onApiPlay() for inactive viewing session.")
                    };
                    this.Qe = function (a) {
                        this.l ? (this.info("Call detected: onApiStop()."), a = a.data, this.k = a[k.z], this.m[this.k] = Math.floor(a[k.N]), a = new j(this.e, this.p, this.G, this.v, z.Mc, this.m[this.k]), a.A = this.u.L(a), this.$(a), d().dispatchEvent(new n(n.TIMER_TRACKING_DISABLE))) : this.warn("Call detected: onApiStop() for inactive viewing session.")
                    };
                    this.Ie = function () {
                        this.l ? this.info("Call detected: onApiClick().") : this.warn("Call detected: onApiClick() for inactive viewing session.")
                    };
                    this.Ke = function () {
                        this.l ? this.info("Call detected: onApiComplete().") :
                            this.warn("Call detected: onApiComplete() for inactive viewing session.")
                    };
                    this.Pe = function (a) {
                        this.l ? (this.info("Call detected: onApiQoSInfo()."), a = a.data, this.v.Ub(a[k.eb]), this.v.Cd(a[k.Pc]), this.v.yd(a[k.Hc])) : this.warn("Call detected: onApiQoSInfo() for inactive viewing session.")
                    };
                    this.Ge = function (a) {
                        if (this.l) {
                            if (this.info("Call detected: onApiBitrateChange()."), this.l) {
                                this.v.Ub(a.data[k.eb]);
                                var b = new j(this.e, this.p, this.G, this.v, z.Xd, this.m[this.k]);
                                b.A = this.u.L(b);
                                this.u.Eb(b);
                                this.Z =
                                    function (a) {
                                        a = this.Pa.Xb(b, a[k.X], !1);
                                        var c = {};
                                        c[k.ya] = a;
                                        d().dispatchEvent(new B(B.wa, c))
                                    };
                                a = {};
                                a[k.la] = q.ta.Ia;
                                d().dispatchEvent(new q(q.ha, a))
                            }
                        } else this.warn("Call detected: onApiBitrateChange() for inactive viewing session.")
                    };
                    this.He = function () {
                        if (this.l) {
                            this.info("Call detected: onApiBufferStart().");
                            var a = new j(this.e, this.p, this.G, this.v, z.Yd, this.m[this.k]);
                            a.A = this.u.L(a);
                            this.$(a)
                        } else this.warn("Call detected: onApiBufferStart() for inactive viewing session.")
                    };
                    this.Re = function (a) {
                        if (this.l) {
                            this.info("Call detected: onApiTrackError().");
                            var b = a.data;
                            if (!(this.Nb && b[k.Kb] !== I)) {
                                var c = new j(this.e, this.p, this.G, this.v, z.Zd, Math.floor(b[k.N]));
                                c.A = this.u.L(c);
                                this.u.Eb(c);
                                this.Z = function (a) {
                                    a = this.Pa.Xb(c, a[k.X], !1);
                                    var m = a.F[0];
                                    m.ba.id(b[k.Jc]);
                                    m.ba.source(b[k.Kb]);
                                    m = {};
                                    m[k.ya] = a;
                                    d().dispatchEvent(new B(B.wa, m))
                                };
                                a = {};
                                a[k.la] = q.ta.Ia;
                                d().dispatchEvent(new q(q.ha, a))
                            }
                        } else this.warn("Call detected: onApiTrackError() for inactive viewing session.")
                    };
                    this.Oe = function (a) {
                        this.l ? (this.info("Call detected: onApiPodOffset()."), this.Rb = Math.floor(a.data[k.Jb])) :
                            this.warn("Call detected: onApiPodOffset() for inactive viewing session.")
                    };
                    this.Te = function (a) {
                        this.l ? (this.info("Call detected: onMonitor()."), this.k = a.data[k.z], this.m[this.k] = Math.floor(a.data[k.N])) : this.warn("Call detected: onMonitor() for inactive viewing session.")
                    };
                    this.Ye = function (a) {
                        if (this.l) {
                            this.info("Call detected: onTimerTrackingTick().");
                            var b = new Date;
                            a = this.Pa.sd(this.Ra || new Date(0), b, a.data[k.X]);
                            var c = {};
                            c[k.ya] = a;
                            d().dispatchEvent(new B(B.wa, c));
                            this.Ra = b
                        } else this.warn("Call detected: onTimerTrackingTick() for inactive viewing session.")
                    };
                    this.Oa = function (a) {
                        this.info("Call detected: onCheckStatusComplete().");
                        if (a.data[k.Mb] !== i) this.Nb = a.data[k.Mb]
                    };
                    this.Pb = function (a) {
                        this.info("Call detected: onDataRequest().");
                        switch (a.data[k.la]) {
                            case q.ta.Sc:
                                a = {}, a[k.mb] = this.g.M, d().dispatchEvent(new q(q.fb, a))
                        }
                    };
                    this.Qb = function (a) {
                        this.info("Call detected: onDataResponse().");
                        this.Ad(a.data)
                    };
                    this.$e = function () {
                        this.l = !1;
                        this.pb = i;
                        this.Nb = !1;
                        this.m = {};
                        this.Ra = this.Rb = i;
                        this.La = new r;
                        this.u = new u;
                        this.U = new g;
                        this.p = new y;
                        this.G = new l;
                        this.v =
                            new w;
                        this.qb = new A;
                        this.e = new o;
                        this.e.M(this.g.M);
                        this.e.type(this.g.Cb)
                    };
                    this.Ee = function () {
                        this.qb.Za("" + (new Date).getTime() + Math.floor(Math.random() * 1E9))
                    };
                    this.$ = function (a) {
                        this.U.ff(a);
                        this.u.Eb(a)
                    };
                    this.Ae = function () {
                        this.m[this.e.i()] == -1 && (this.m[this.e.i()] = this.e.duration());
                        var a = new j(this.e, this.p, this.G, this.v, z.Lc, this.m[this.e.i()]);
                        a.A = this.u.L(a);
                        this.$(a);
                        this.Z = function (a) {
                            var b = new Date;
                            a = this.Pa.sd(this.Ra || new Date(0), b, a[k.X]);
                            var c = {};
                            c[k.ya] = a;
                            d().dispatchEvent(new B(B.wa,
                                c));
                            this.Ra = b
                        };
                        a = {};
                        a[k.la] = q.ta.Ia;
                        d().dispatchEvent(new q(q.ha, a));
                        d().dispatchEvent(new n(n.TIMER_TRACKING_DISABLE));
                        this.l = !1
                    };
                    this.ze = function () {
                        var a = new j(this.e, this.p, this.G, this.v, z.Lc, this.m[this.k]);
                        a.A = this.u.L(a);
                        this.$(a);
                        this.e.type(this.pb);
                        this.k = this.e.i();
                        this.e.n(i)
                    };
                    d().addEventListener(v.Fb, this.Ob, this);
                    d().addEventListener(v.Ga, this.na, this);
                    d().addEventListener(v.wc, this.Me, this);
                    d().addEventListener(v.vc, this.Le, this);
                    d().addEventListener(v.sc, this.Je, this);
                    d().addEventListener(v.xc,
                        this.Ne, this);
                    d().addEventListener(v.zc, this.Qe, this);
                    d().addEventListener(v.rc, this.Ie, this);
                    d().addEventListener(v.tc, this.Ke, this);
                    d().addEventListener(v.yc, this.Pe, this);
                    d().addEventListener(v.pc, this.Ge, this);
                    d().addEventListener(v.qc, this.He, this);
                    d().addEventListener(v.Ac, this.Re, this);
                    d().addEventListener(v.Gb, this.Oe, this);
                    d().addEventListener(v.uc, this.Te, this);
                    d().addEventListener(n.TIMER_TRACKING_TICK, this.Ye, this);
                    d().addEventListener(E.jb, this.Oa, this);
                    d().addEventListener(q.ha, this.Pb,
                        this);
                    d().addEventListener(q.fb, this.Qb, this)
                }
                var m = c.ea,
                    h = c.da,
                    d = c.W,
                    e = a.C.he,
                    g = a.C.re,
                    j = a.C.fd,
                    u = a.C.ae,
                    A = a.a.le,
                    x = a.a.ne,
                    o = a.a.cb,
                    p = a.a.ke,
                    y = a.a.hd,
                    l = a.a.$c,
                    w = a.a.ce,
                    r = a.C.Vd,
                    n = a.event.Ja,
                    E = a.event.kb,
                    q = a.event.Hb,
                    v = a.event.Ha,
                    B = a.event.Fc,
                    k = a.event.ja,
                    z = a.a.gb,
                    s = a.a.Bc,
                    I = "sourceErrorSDK";
                m(b, c.vd);
                m(b, h);
                a.C.Ud = b
            })(g, d);
            (function (c) {
                function a(a) {
                    this.q = a;
                    this.D = function () {
                        var a = this.Aa && (this.q.analyticsVisitorID || this.q.marketingCloudVisitorID || this.q.visitorID);
                        a || this.warn("Unable to track! Is configured: " +
                            this.Aa + " analyticsVisitorID: " + this.q.analyticsVisitorID + " marketingCloudVisitorID: " + this.q.marketingCloudVisitorID + " visitorID: " + this.q.visitorID);
                        return a
                    };
                    this.Aa = !1;
                    this.j = new t;
                    this.Sf = new w(new A);
                    this.ld = new j;
                    this.Sb = i;
                    this.g = {
                        trackingServer: i,
                        Id: i,
                        M: i,
                        Cb: i,
                        Ca: i,
                        Da: i,
                        channel: i,
                        debugTracking: !1,
                        Rd: !1
                    }
                }
                var b = g.ea,
                    m = g.W,
                    d = c.event.ja,
                    e = c.event.Ha,
                    j = c.I.Td,
                    w = c.Wa.be,
                    t = c.C.Ud,
                    u = c.a.cb,
                    A = c.a.de;
                b(a, g.da);
                a.prototype.Hf = function (a) {
                    this.info("Setting-up the media-fork instance");
                    this.g.debugTracking =
                        this.q.debugTracking;
                    this.g.Rd = this.q.trackLocal;
                    if (a) {
                        if (a.hasOwnProperty("trackingServer")) this.g.trackingServer = a.trackingServer;
                        if (a.hasOwnProperty("jobId")) this.g.Id = a.jobId;
                        if (a.hasOwnProperty("publisher")) this.g.M = a.publisher;
                        if (a.hasOwnProperty("ovp")) this.g.Ca = a.ovp;
                        if (a.hasOwnProperty("sdk")) this.g.Da = a.sdk;
                        if (a.hasOwnProperty("channel")) this.g.channel = a.channel;
                        if (a.hasOwnProperty("streamType")) this.g.Cb = a.streamType === u.ed || a.streamType === u.qe || a.streamType === u.oe || a.streamType === u.za ?
                            a.streamType : u.ed;
                        if (this.q.__primetime) this.g.Ca = "primetime";
                        if (this.Sb != i) this.g.Da = this.Sb;
                        a = {};
                        a[d.oc] = this.q.account;
                        a[d.Xc] = this.q.trackingServer;
                        a[d.cd] = this.g.trackingServer;
                        a[d.Ec] = this.g.trackingServer + "/settings/";
                        a[d.Rc] = this.g.Id;
                        a[d.mb] = this.g.M;
                        a[d.Tc] = this.g.Ca;
                        a[d.Yc] = this.g.Da;
                        a[d.Cc] = this.g.channel;
                        a[d.Gc] = this.g.debugTracking;
                        a[d.overlayIframe] = this.g.Rd;
                        m().dispatchEvent(new e(e.Fb, a));
                        this.Aa = !0
                    }
                };
                a.prototype.open = function (a, b, c) {
                    this.info("Call detected: open().");
                    if (this.D()) {
                        var g = {};
                        g[d.nb] = this.q.visitorID;
                        g[d.bb] = this.q.analyticsVisitorID;
                        g[d.ib] = this.q.xf;
                        g[d.z] = a;
                        g[d.hb] = b;
                        g[d.Zc] = this.g.Cb;
                        g[d.lb] = c;
                        m().dispatchEvent(new e(e.wc, g))
                    }
                };
                a.prototype.openAd = function (a, b, c, g, j, t, r) {
                    this.info("Call detected: openAd().");
                    if (this.D()) {
                        var n = {};
                        n[d.z] = a;
                        n[d.hb] = b;
                        n[d.lb] = c;
                        n[d.Uc] = g;
                        n[d.Vc] = j;
                        n[d.Wc] = t;
                        n[d.xa] = r;
                        m().dispatchEvent(new e(e.vc, n))
                    }
                };
                a.prototype.close = function (a) {
                    this.info("Call detected: close().");
                    if (this.D()) {
                        var b = {};
                        b[d.z] = a;
                        m().dispatchEvent(new e(e.sc, b))
                    }
                };
                a.prototype.play =
                    function (a, b) {
                        this.info("Call detected: play().");
                        if (this.D()) {
                            var c = {};
                            c[d.nb] = this.q.visitorID;
                            c[d.bb] = this.q.analyticsVisitorID;
                            c[d.ib] = this.q.xf;
                            c[d.z] = a;
                            c[d.N] = b;
                            m().dispatchEvent(new e(e.xc, c))
                        }
                    };
                a.prototype.monitor = function (a, b) {
                    this.info("Call detected: monitor().");
                    var c = {};
                    c[d.z] = a;
                    c[d.N] = b;
                    m().dispatchEvent(new e(e.uc, c))
                };
                a.prototype.stop = function (a, b) {
                    this.info("Call detected: stop().");
                    if (this.D()) {
                        var c = {};
                        c[d.z] = a;
                        c[d.N] = b;
                        m().dispatchEvent(new e(e.zc, c))
                    }
                };
                a.prototype.click = function (a,
                                              b) {
                    this.info("Call detected: click().");
                    if (this.D()) {
                        var c = {};
                        c[d.z] = a;
                        c[d.N] = b;
                        m().dispatchEvent(new e(e.rc, c))
                    }
                };
                a.prototype.complete = function (a, b) {
                    this.info("Call detected: complete().");
                    if (this.D()) {
                        var c = {};
                        c[d.z] = a;
                        c[d.N] = b;
                        m().dispatchEvent(new e(e.tc, c))
                    }
                };
                a.prototype.wd = function () {
                    m().dispatchEvent(new e(e.Ga))
                };
                a.prototype.Lf = function (a, b, c) {
                    if (this.D()) {
                        var g = {};
                        g[d.Kb] = a;
                        g[d.Jc] = b;
                        g[d.N] = c;
                        m().dispatchEvent(new e(e.Ac, g))
                    }
                };
                a.prototype.Nf = function (a, b, c) {
                    if (this.D()) {
                        var g = {};
                        g[d.eb] =
                            a;
                        g[d.Pc] = b;
                        g[d.Hc] = c;
                        m().dispatchEvent(new e(e.yc, g))
                    }
                };
                a.prototype.jf = function (a) {
                    if (this.D()) {
                        var b = {};
                        b[d.eb] = a;
                        m().dispatchEvent(new e(e.pc, b))
                    }
                };
                a.prototype.kf = function () {
                    this.D() && m().dispatchEvent(new e(e.qc))
                };
                a.prototype.ef = function (a) {
                    if (this.D()) {
                        var b = {};
                        b[d.Jb] = a;
                        m().dispatchEvent(new e(e.Gb, b))
                    }
                };
                a.prototype.df = function () {
                    if (this.D()) {
                        var a = {};
                        a[d.Jb] = i;
                        m().dispatchEvent(new e(e.Gb, a))
                    }
                };
                a.prototype.ye = function (a) {
                    this.Sb = a
                };
                c.$d = a
            })(d);
            m.Fa || (m.Fa = {});
            m.Fa.of || (m.Fa.of = g);
            m.Fa.yf =
                d
        })(this);
        this.xe(m)
    }(m.s);
    E.callMethodWhenReady = function (d, m) {
        s.visitor != i && (s.isReadyToTrack() ? E[d].apply(this, m) : s.callbackWhenReadyToTrack(E, E[d], m))
    };
    m.Heartbeat = E;
    m.gf = function () {
        var d, e;
        if (m.autoTrack && (d = m.s.d.getElementsByTagName("VIDEO")))
            for (e = 0; e < d.length; e++) m.attach(d[e])
    };
    m.ma(w, "load", m.gf)
}

/* HERE ENDS THE MEDIA MODULE */


/*
 ============== DO NOT ALTER ANYTHING BELOW THIS LINE ! ===============
 AppMeasurement for JavaScript version: 1.2.1
 Copyright 1996-2013 Adobe, Inc. All Rights Reserved
 More info available at http://www.omniture.com
 */
function AppMeasurement() {
    var s = this;
    s.version = "1.2.1";
    var w = window;
    if (!w.s_c_in) w.s_c_il = [], w.s_c_in = 0;
    s._il = w.s_c_il;
    s._in = w.s_c_in;
    s._il[s._in] = s;
    w.s_c_in++;
    s._c = "s_c";
    var k = w.fb;
    k || (k = null);
    var m = w,
        i, n;
    try {
        i = m.parent;
        for (n = m.location; i && i.location && n && "" + i.location != "" + n && m.location && "" + i.location != "" + m.location && i.location.host == n.host;) m = i, i = m.parent
    } catch (p) {}
    s.Sa = function (s) {
        try {
            console.log(s)
        } catch (a) {}
    };
    s.ja = function (s) {
        return "" + parseInt(s) == "" + s
    };
    s.replace = function (s, a, c) {
        if (!s || s.indexOf(a) <
            0) return s;
        return s.split(a).join(c)
    };
    s.escape = function (b) {
        var a, c;
        if (!b) return b;
        b = encodeURIComponent(b);
        for (a = 0; a < 7; a++) c = "+~!*()'".substring(a, a + 1), b.indexOf(c) >= 0 && (b = s.replace(b, c, "%" + c.charCodeAt(0).toString(16).toUpperCase()));
        return b
    };
    s.unescape = function (b) {
        if (!b) return b;
        b = b.indexOf("+") >= 0 ? s.replace(b, "+", " ") : b;
        try {
            return decodeURIComponent(b)
        } catch (a) {}
        return unescape(b)
    };
    s.Ja = function () {
        var b = w.location.hostname,
            a = s.fpCookieDomainPeriods,
            c;
        if (!a) a = s.cookieDomainPeriods;
        if (b && !s.ca && !/^[0-9.]+$/.test(b) && (a = a ? parseInt(a) : 2, a = a > 2 ? a : 2, c = b.lastIndexOf("."), c >= 0)) {
            for (; c >= 0 && a > 1;) c = b.lastIndexOf(".", c - 1), a--;
            s.ca = c > 0 ? b.substring(c) : b
        }
        return s.ca
    };
    s.c_r = s.cookieRead = function (b) {
        b = s.escape(b);
        var a = " " + s.d.cookie,
            c = a.indexOf(" " + b + "="),
            e = c < 0 ? c : a.indexOf(";", c);
        b = c < 0 ? "" : s.unescape(a.substring(c + 2 + b.length, e < 0 ? a.length : e));
        return b != "[[B]]" ? b : ""
    };
    s.c_w = s.cookieWrite = function (b, a, c) {
        var e = s.Ja(),
            d = s.cookieLifetime,
            f;
        a = "" + a;
        d = d ? ("" + d).toUpperCase() : "";
        c && d != "SESSION" && d != "NONE" && ((f = a !=
            "" ? parseInt(d ? d : 0) : -60) ? (c = new Date, c.setTime(c.getTime() + f * 1E3)) : c == 1 && (c = new Date, f = c.getYear(), c.setYear(f + 5 + (f < 1900 ? 1900 : 0))));
        if (b && d != "NONE") return s.d.cookie = b + "=" + s.escape(a != "" ? a : "[[B]]") + "; path=/;" + (c && d != "SESSION" ? " expires=" + c.toGMTString() + ";" : "") + (e ? " domain=" + e + ";" : ""), s.cookieRead(b) == a;
        return 0
    };
    s.C = [];
    s.B = function (b, a, c) {
        if (s.da) return 0;
        if (!s.maxDelay) s.maxDelay = 250;
        var e = 0,
            d = (new Date).getTime() + s.maxDelay,
            f = s.d.cb,
            g = ["webkitvisibilitychange", "visibilitychange"];
        if (!f) f = s.d.eb;
        if (f && f == "prerender") {
            if (!s.M) {
                s.M = 1;
                for (c = 0; c < g.length; c++) s.d.addEventListener(g[c], function () {
                    var b = s.d.cb;
                    if (!b) b = s.d.eb;
                    if (b == "visible") s.M = 0, s.delayReady()
                })
            }
            e = 1;
            d = 0
        } else c || s.q("_d") && (e = 1);
        e && (s.C.push({
            m: b,
            a: a,
            t: d
        }), s.M || setTimeout(s.delayReady, s.maxDelay));
        return e
    };
    s.delayReady = function () {
        var b = (new Date).getTime(),
            a = 0,
            c;
        for (s.q("_d") && (a = 1); s.C.length > 0;) {
            c = s.C.shift();
            if (a && !c.t && c.t > b) {
                s.C.unshift(c);
                setTimeout(s.delayReady, parseInt(s.maxDelay / 2));
                break
            }
            s.da = 1;
            s[c.m].apply(s, c.a);
            s.da =
                0
        }
    };
    s.setAccount = s.sa = function (b) {
        var a, c;
        if (!s.B("setAccount", arguments))
            if (s.account = b, s.allAccounts) {
                a = s.allAccounts.concat(b.split(","));
                s.allAccounts = [];
                a.sort();
                for (c = 0; c < a.length; c++)(c == 0 || a[c - 1] != a[c]) && s.allAccounts.push(a[c])
            } else s.allAccounts = b.split(",")
    };
    s.W = function (b, a, c, e, d) {
        var f = "",
            g, j, w, q, i = 0;
        b == "contextData" && (b = "c");
        if (a) {
            for (g in a)
                if (!Object.prototype[g] && (!d || g.substring(0, d.length) == d) && a[g] && (!c || c.indexOf("," + (e ? e + "." : "") + g + ",") >= 0)) {
                    w = !1;
                    if (i)
                        for (j = 0; j < i.length; j++) g.substring(0,
                            i[j].length) == i[j] && (w = !0);
                    if (!w && (f == "" && (f += "&" + b + "."), j = a[g], d && (g = g.substring(d.length)), g.length > 0))
                        if (w = g.indexOf("."), w > 0) j = g.substring(0, w), w = (d ? d : "") + j + ".", i || (i = []), i.push(w), f += s.W(j, a, c, e, w);
                        else if (typeof j == "boolean" && (j = j ? "true" : "false"), j) {
                            if (e == "retrieveLightData" && d.indexOf(".contextData.") < 0) switch (w = g.substring(0, 4), q = g.substring(4), g) {
                                case "transactionID":
                                    g = "xact";
                                    break;
                                case "channel":
                                    g = "ch";
                                    break;
                                case "campaign":
                                    g = "v0";
                                    break;
                                default:
                                    s.ja(q) && (w == "prop" ? g = "c" + q : w == "eVar" ? g = "v" +
                                        q : w == "list" ? g = "l" + q : w == "hier" && (g = "h" + q, j = j.substring(0, 255)))
                            }
                            f += "&" + s.escape(g) + "=" + s.escape(j)
                        }
                }
            f != "" && (f += "&." + b)
        }
        return f
    };
    s.La = function () {
        var b = "",
            a, c, e, d, f, g, j, w, i = "",
            k = "",
            m = c = "";
        if (s.lightProfileID) a = s.P, (i = s.lightTrackVars) && (i = "," + i + "," + s.ma.join(",") + ",");
        else {
            a = s.e;
            if (s.pe || s.linkType)
                if (i = s.linkTrackVars, k = s.linkTrackEvents, s.pe && (c = s.pe.substring(0, 1).toUpperCase() + s.pe.substring(1), s[c])) i = s[c].pb, k = s[c].ob;
            i && (i = "," + i + "," + s.H.join(",") + ",");
            k && (k = "," + k + ",", i && (i += ",events,"));
            s.events2 &&
            (m += (m != "" ? "," : "") + s.events2)
        }
        for (c = 0; c < a.length; c++) {
            d = a[c];
            f = s[d];
            e = d.substring(0, 4);
            g = d.substring(4);
            !f && d == "events" && m && (f = m, m = "");
            if (f && (!i || i.indexOf("," + d + ",") >= 0)) {
                switch (d) {
                    case "timestamp":
                        d = "ts";
                        break;
                    case "dynamicVariablePrefix":
                        d = "D";
                        break;
                    case "visitorID":
                        d = "vid";
                        break;
                    case "marketingCloudVisitorID":
                        d = "mid";
                        break;
                    case "analyticsVisitorID":
                        d = "aid";
                        break;
                    case "audienceManagerVisitorID":
                        d = "aamid";
                        break;
                    case "audienceManagerLocationHint":
                        d = "aamlh";
                        break;
                    case "pageURL":
                        d = "g";
                        if (f.length >
                            255) s.pageURLRest = f.substring(255), f = f.substring(0, 255);
                        break;
                    case "pageURLRest":
                        d = "-g";
                        break;
                    case "referrer":
                        d = "r";
                        break;
                    case "vmk":
                    case "visitorMigrationKey":
                        d = "vmt";
                        break;
                    case "visitorMigrationServer":
                        d = "vmf";
                        s.ssl && s.visitorMigrationServerSecure && (f = "");
                        break;
                    case "visitorMigrationServerSecure":
                        d = "vmf";
                        !s.ssl && s.visitorMigrationServer && (f = "");
                        break;
                    case "charSet":
                        d = "ce";
                        break;
                    case "visitorNamespace":
                        d = "ns";
                        break;
                    case "cookieDomainPeriods":
                        d = "cdp";
                        break;
                    case "cookieLifetime":
                        d = "cl";
                        break;
                    case "variableProvider":
                        d =
                            "vvp";
                        break;
                    case "currencyCode":
                        d = "cc";
                        break;
                    case "channel":
                        d = "ch";
                        break;
                    case "transactionID":
                        d = "xact";
                        break;
                    case "campaign":
                        d = "v0";
                        break;
                    case "resolution":
                        d = "s";
                        break;
                    case "colorDepth":
                        d = "c";
                        break;
                    case "javascriptVersion":
                        d = "j";
                        break;
                    case "javaEnabled":
                        d = "v";
                        break;
                    case "cookiesEnabled":
                        d = "k";
                        break;
                    case "browserWidth":
                        d = "bw";
                        break;
                    case "browserHeight":
                        d = "bh";
                        break;
                    case "connectionType":
                        d = "ct";
                        break;
                    case "homepage":
                        d = "hp";
                        break;
                    case "plugins":
                        d = "p";
                        break;
                    case "events":
                        m && (f += (f != "" ? "," : "") + m);
                        if (k) {
                            g =
                                f.split(",");
                            f = "";
                            for (e = 0; e < g.length; e++) j = g[e], w = j.indexOf("="), w >= 0 && (j = j.substring(0, w)), w = j.indexOf(":"), w >= 0 && (j = j.substring(0, w)), k.indexOf("," + j + ",") >= 0 && (f += (f ? "," : "") + g[e])
                        }
                        break;
                    case "events2":
                        f = "";
                        break;
                    case "contextData":
                        b += s.W("c", s[d], i, d);
                        f = "";
                        break;
                    case "lightProfileID":
                        d = "mtp";
                        break;
                    case "lightStoreForSeconds":
                        d = "mtss";
                        s.lightProfileID || (f = "");
                        break;
                    case "lightIncrementBy":
                        d = "mti";
                        s.lightProfileID || (f = "");
                        break;
                    case "retrieveLightProfiles":
                        d = "mtsr";
                        break;
                    case "deleteLightProfiles":
                        d =
                            "mtsd";
                        break;
                    case "retrieveLightData":
                        s.retrieveLightProfiles && (b += s.W("mts", s[d], i, d));
                        f = "";
                        break;
                    default:
                        s.ja(g) && (e == "prop" ? d = "c" + g : e == "eVar" ? d = "v" + g : e == "list" ? d = "l" + g : e == "hier" && (d = "h" + g, f = f.substring(0, 255)))
                }
                f && (b += "&" + d + "=" + (d.substring(0, 3) != "pev" ? s.escape(f) : f))
            }
            d == "pev3" && s.g && (b += s.g)
        }
        return b
    };
    s.u = function (s) {
        var a = s.tagName;
        if ("" + s.nb != "undefined" || "" + s.Xa != "undefined" && ("" + s.Xa).toUpperCase() != "HTML") return "";
        a = a && a.toUpperCase ? a.toUpperCase() : "";
        a == "SHAPE" && (a = "");
        a && ((a == "INPUT" ||
            a == "BUTTON") && s.type && s.type.toUpperCase ? a = s.type.toUpperCase() : !a && s.href && (a = "A"));
        return a
    };
    s.fa = function (s) {
        var a = s.href ? s.href : "",
            c, e, d;
        c = a.indexOf(":");
        e = a.indexOf("?");
        d = a.indexOf("/");
        if (a && (c < 0 || e >= 0 && c > e || d >= 0 && c > d)) e = s.protocol && s.protocol.length > 1 ? s.protocol : l.protocol ? l.protocol : "", c = l.pathname.lastIndexOf("/"), a = (e ? e + "//" : "") + (s.host ? s.host : l.host ? l.host : "") + (h.substring(0, 1) != "/" ? l.pathname.substring(0, c < 0 ? 0 : c) + "/" : "") + a;
        return a
    };
    s.D = function (b) {
        var a = s.u(b),
            c, e, d = "",
            f = 0;
        if (a) {
            c = b.protocol;
            e = b.onclick;
            if (b.href && (a == "A" || a == "AREA") && (!e || !c || c.toLowerCase().indexOf("javascript") < 0)) d = s.fa(b);
            else if (e) d = s.replace(s.replace(s.replace(s.replace("" + e, "\r", ""), "\n", ""), "\t", ""), " ", ""), f = 2;
            else if (a == "INPUT" || a == "SUBMIT") {
                if (b.value) d = b.value;
                else if (b.innerText) d = b.innerText;
                else if (b.textContent) d = b.textContent;
                f = 3
            } else if (b.src && a == "IMAGE") d = b.src;
            if (d) return {
                id: d.substring(0, 100),
                type: f
            }
        }
        return 0
    };
    s.kb = function (b) {
        for (var a = s.u(b), c = s.D(b); b && !c && a != "BODY";)
            if (b = b.parentElement ? b.parentElement :
                b.parentNode) a = s.u(b), c = s.D(b);
        if (!c || a == "BODY") b = 0;
        if (b && (a = b.onclick ? "" + b.onclick : "", a.indexOf(".tl(") >= 0 || a.indexOf(".trackLink(") >= 0)) b = 0;
        return b
    };
    s.Va = function () {
        var b, a, c = s.linkObject,
            e = s.linkType,
            d = s.linkURL,
            f, g;
        s.Q = 1;
        if (!c) s.Q = 0, c = s.j;
        if (c) {
            b = s.u(c);
            for (a = s.D(c); c && !a && b != "BODY";)
                if (c = c.parentElement ? c.parentElement : c.parentNode) b = s.u(c), a = s.D(c);
            if (!a || b == "BODY") c = 0;
            if (c) {
                var j = c.onclick ? "" + c.onclick : "";
                if (j.indexOf(".tl(") >= 0 || j.indexOf(".trackLink(") >= 0) c = 0
            }
        } else s.Q = 1;
        !d && c && (d = s.fa(c));
        d && !s.linkLeaveQueryString && (f = d.indexOf("?"), f >= 0 && (d = d.substring(0, f)));
        if (!e && d) {
            var i = 0,
                k = 0,
                m;
            if (s.trackDownloadLinks && s.linkDownloadFileTypes) {
                j = d.toLowerCase();
                f = j.indexOf("?");
                g = j.indexOf("#");
                f >= 0 ? g >= 0 && g < f && (f = g) : f = g;
                f >= 0 && (j = j.substring(0, f));
                f = s.linkDownloadFileTypes.toLowerCase().split(",");
                for (g = 0; g < f.length; g++)(m = f[g]) && j.substring(j.length - (m.length + 1)) == "." + m && (e = "d")
            }
            if (s.trackExternalLinks && !e && (j = d.toLowerCase(), s.ia(j))) {
                if (!s.linkInternalFilters) s.linkInternalFilters = w.location.hostname;
                f = 0;
                s.linkExternalFilters ? (f = s.linkExternalFilters.toLowerCase().split(","), i = 1) : s.linkInternalFilters && (f = s.linkInternalFilters.toLowerCase().split(","));
                if (f) {
                    for (g = 0; g < f.length; g++) m = f[g], j.indexOf(m) >= 0 && (k = 1);
                    k ? i && (e = "e") : i || (e = "e")
                }
            }
        }
        s.linkObject = c;
        s.linkURL = d;
        s.linkType = e;
        if (s.trackClickMap || s.trackInlineStats)
            if (s.g = "", c) {
                e = s.pageName;
                d = 1;
                c = c.sourceIndex;
                if (!e) e = s.pageURL, d = 0;
                if (w.s_objectID) a.id = w.s_objectID, c = a.type = 1;
                if (e && a && a.id && b) s.g = "&pid=" + s.escape(e.substring(0, 255)) + (d ? "&pidt=" +
                    d : "") + "&oid=" + s.escape(a.id.substring(0, 100)) + (a.type ? "&oidt=" + a.type : "") + "&ot=" + b + (c ? "&oi=" + c : "")
            }
    };
    s.Ma = function () {
        var b = s.Q,
            a = s.linkType,
            c = s.linkURL,
            e = s.linkName;
        if (a && (c || e)) a = a.toLowerCase(), a != "d" && a != "e" && (a = "o"), s.pe = "lnk_" + a, s.pev1 = c ? s.escape(c) : "", s.pev2 = e ? s.escape(e) : "", b = 1;
        s.abort && (b = 0);
        if (s.trackClickMap || s.trackInlineStats) {
            a = {};
            c = 0;
            var d = s.cookieRead("s_sq"),
                f = d ? d.split("&") : 0,
                g, j, w;
            d = 0;
            if (f)
                for (g = 0; g < f.length; g++) j = f[g].split("="), e = s.unescape(j[0]).split(","), j = s.unescape(j[1]),
                    a[j] = e;
            e = s.account.split(",");
            if (b || s.g) {
                b && !s.g && (d = 1);
                for (j in a)
                    if (!Object.prototype[j])
                        for (g = 0; g < e.length; g++) {
                            d && (w = a[j].join(","), w == s.account && (s.g += (j.charAt(0) != "&" ? "&" : "") + j, a[j] = [], c = 1));
                            for (f = 0; f < a[j].length; f++) w = a[j][f], w == e[g] && (d && (s.g += "&u=" + s.escape(w) + (j.charAt(0) != "&" ? "&" : "") + j + "&u=0"), a[j].splice(f, 1), c = 1)
                        }
                b || (c = 1);
                if (c) {
                    d = "";
                    g = 2;
                    !b && s.g && (d = s.escape(e.join(",")) + "=" + s.escape(s.g), g = 1);
                    for (j in a)!Object.prototype[j] && g > 0 && a[j].length > 0 && (d += (d ? "&" : "") + s.escape(a[j].join(",")) +
                        "=" + s.escape(j), g--);
                    s.cookieWrite("s_sq", d)
                }
            }
        }
        return b
    };
    s.Na = function () {
        if (!s.bb) {
            var b = new Date,
                a = m.location,
                c, e, d, f = d = e = c = "",
                g = "",
                w = "",
                i = "1.2",
                k = s.cookieWrite("s_cc", "true", 0) ? "Y" : "N",
                n = "",
                p = "",
                o = 0;
            if (b.setUTCDate && (i = "1.3", o.toPrecision && (i = "1.5", c = [], c.forEach))) {
                i = "1.6";
                d = 0;
                e = {};
                try {
                    d = new Iterator(e), d.next && (i = "1.7", c.reduce && (i = "1.8", i.trim && (i = "1.8.1", Date.parse && (i = "1.8.2", Object.create && (i = "1.8.5")))))
                } catch (r) {}
            }
            c = screen.width + "x" + screen.height;
            d = navigator.javaEnabled() ? "Y" : "N";
            e = screen.pixelDepth ?
                screen.pixelDepth : screen.colorDepth;
            g = s.w.innerWidth ? s.w.innerWidth : s.d.documentElement.offsetWidth;
            w = s.w.innerHeight ? s.w.innerHeight : s.d.documentElement.offsetHeight;
            b = navigator.plugins;
            try {
                s.b.addBehavior("#default#homePage"), n = s.b.lb(a) ? "Y" : "N"
            } catch (t) {}
            try {
                s.b.addBehavior("#default#clientCaps"), p = s.b.connectionType
            } catch (u) {}
            if (b)
                for (; o < b.length && o < 30;) {
                    if (a = b[o].name) a = a.substring(0, 100) + ";", f.indexOf(a) < 0 && (f += a);
                    o++
                }
            s.resolution = c;
            s.colorDepth = e;
            s.javascriptVersion = i;
            s.javaEnabled = d;
            s.cookiesEnabled =
                k;
            s.browserWidth = g;
            s.browserHeight = w;
            s.connectionType = p;
            s.homepage = n;
            s.plugins = f;
            s.bb = 1
        }
    };
    s.G = {};
    s.loadModule = function (b, a) {
        var c = s.G[b];
        if (!c) {
            c = w["AppMeasurement_Module_" + b] ? new w["AppMeasurement_Module_" + b](s) : {};
            s.G[b] = s[b] = c;
            c.ua = function () {
                return c.wa
            };
            c.xa = function (a) {
                if (c.wa = a) s[b + "_onLoad"] = a, s.B(b + "_onLoad", [s, c], 1) || a(s, c)
            };
            try {
                Object.defineProperty ? Object.defineProperty(c, "onLoad", {
                    get: c.ua,
                    set: c.xa
                }) : c._olc = 1
            } catch (e) {
                c._olc = 1
            }
        }
        a && (s[b + "_onLoad"] = a, s.B(b + "_onLoad", [s, c], 1) || a(s, c))
    };
    s.q = function (b) {
        var a, c;
        for (a in s.G)
            if (!Object.prototype[a] && (c = s.G[a])) {
                if (c._olc && c.onLoad) c._olc = 0, c.onLoad(s, c);
                if (c[b] && c[b]()) return 1
            }
        return 0
    };
    s.Qa = function () {
        var b = Math.floor(Math.random() * 1E13),
            a = s.visitorSampling,
            c = s.visitorSamplingGroup;
        c = "s_vsn_" + (s.visitorNamespace ? s.visitorNamespace : s.account) + (c ? "_" + c : "");
        var e = s.cookieRead(c);
        if (a) {
            e && (e = parseInt(e));
            if (!e) {
                if (!s.cookieWrite(c, b)) return 0;
                e = b
            }
            if (e % 1E4 > v) return 0
        }
        return 1
    };
    s.I = function (b, a) {
        var c, e, d, f, g, w;
        for (c = 0; c < 2; c++) {
            e = c > 0 ?
                s.$ : s.e;
            for (d = 0; d < e.length; d++)
                if (f = e[d], (g = b[f]) || b["!" + f]) {
                    if (!a && (f == "contextData" || f == "retrieveLightData") && s[f])
                        for (w in s[f]) g[w] || (g[w] = s[f][w]);
                    s[f] = g
                }
        }
    };
    s.qa = function (b, a) {
        var c, e, d, f;
        for (c = 0; c < 2; c++) {
            e = c > 0 ? s.$ : s.e;
            for (d = 0; d < e.length; d++) f = e[d], b[f] = s[f], !a && !b[f] && (b["!" + f] = 1)
        }
    };
    s.Ia = function (s) {
        var a, c, e, d, f, g = 0,
            w, i = "",
            k = "";
        if (s && s.length > 255 && (a = "" + s, c = a.indexOf("?"), c > 0 && (w = a.substring(c + 1), a = a.substring(0, c), d = a.toLowerCase(), e = 0, d.substring(0, 7) == "http://" ? e += 7 : d.substring(0, 8) == "https://" &&
            (e += 8), c = d.indexOf("/", e), c > 0 && (d = d.substring(e, c), f = a.substring(c), a = a.substring(0, c), d.indexOf("google") >= 0 ? g = ",q,ie,start,search_key,word,kw,cd," : d.indexOf("yahoo.co") >= 0 && (g = ",p,ei,"), g && w)))) {
            if ((s = w.split("&")) && s.length > 1) {
                for (e = 0; e < s.length; e++) d = s[e], c = d.indexOf("="), c > 0 && g.indexOf("," + d.substring(0, c) + ",") >= 0 ? i += (i ? "&" : "") + d : k += (k ? "&" : "") + d;
                i && k ? w = i + "&" + k : k = ""
            }
            c = 253 - (w.length - k.length) - a.length;
            s = a + (c > 0 ? f.substring(0, c) : "") + "?" + w
        }
        return s
    };
    s.za = !1;
    s.Z = !1;
    s.ib = function (b) {
        s.marketingCloudVisitorID =
            b;
        s.Z = !0;
        s.z()
    };
    s.J = !1;
    s.X = !1;
    s.ta = function (b) {
        s.analyticsVisitorID = b;
        s.X = !0;
        s.z()
    };
    s.ya = !1;
    s.Y = !1;
    s.hb = function (b) {
        s.audienceManagerVisitorID = b;
        if (s.audienceManagerVisitorID && s.visitor.getAudienceManagerLocationHint) s.audienceManagerLocationHint = s.visitor.getAudienceManagerLocationHint();
        s.Y = !0;
        s.z()
    };
    s.isReadyToTrack = function () {
        var b = !0,
            a = s.visitor;
        if (a && a.isAllowed()) {
            if (!s.J && !s.analyticsVisitorID && a.getAnalyticsVisitorID && (s.analyticsVisitorID = a.getAnalyticsVisitorID([s, s.ta]), !s.analyticsVisitorID)) s.J = !0;
            if (s.za && !s.Z && !s.marketingCloudVisitorID || s.J && !s.X && !s.analyticsVisitorID || s.ya && !s.Y && !s.audienceManagerVisitorID) b = !1
        }
        return b
    };
    s.k = k;
    s.l = 0;
    s.callbackWhenReadyToTrack = function (b, a, c) {
        var e;
        e = {};
        e.Da = b;
        e.Ca = a;
        e.Aa = c;
        if (s.k == k) s.k = [];
        s.k.push(e);
        if (s.l == 0) s.l = setInterval(s.z, 100)
    };
    s.z = function () {
        var b;
        if (s.isReadyToTrack()) {
            if (s.l) clearInterval(s.l), s.l = 0;
            if (s.k != k)
                for (; s.k.length > 0;) b = s.k.shift(), b.Ca.apply(b.Da, b.Aa)
        }
    };
    s.va = function (b) {
        var a, c, e = k,
            d = k;
        if (!s.isReadyToTrack()) {
            a = [];
            if (b != k)
                for (c in e = {}, b) e[c] = b[c];
            d = {};
            s.qa(d, !0);
            a.push(e);
            a.push(d);
            s.callbackWhenReadyToTrack(s, s.track, a);
            return !0
        }
        return !1
    };
    s.Ka = function () {
        var b = s.cookieRead("s_fid"),
            a = "",
            c = "",
            e;
        e = 8;
        var d = 4;
        if (!b || b.indexOf("-") < 0) {
            for (b = 0; b < 16; b++) e = Math.floor(Math.random() * e), a += "0123456789ABCDEF".substring(e, e + 1), e = Math.floor(Math.random() * d), c += "0123456789ABCDEF".substring(e, e + 1), e = d = 16;
            b = a + "-" + c
        }
        s.cookieWrite("s_fid", b, 1) || (b = 0);
        return b
    };
    s.t = s.track = function (b, a) {
        var c, e = new Date,
            d = "s" + Math.floor(e.getTime() / 108E5) % 10 +
                Math.floor(Math.random() * 1E13),
            f = e.getYear();
        f = "t=" + s.escape(e.getDate() + "/" + e.getMonth() + "/" + (f < 1900 ? f + 1900 : f) + " " + e.getHours() + ":" + e.getMinutes() + ":" + e.getSeconds() + " " + e.getDay() + " " + e.getTimezoneOffset());
        s.q("_s");
        if (!s.B("track", arguments)) {
            if (!s.va(b)) {
                a && s.I(a);
                b && (c = {}, s.qa(c, 0), s.I(b));
                if (s.Qa()) {
                    if (!s.analyticsVisitorID && !s.marketingCloudVisitorID) s.fid = s.Ka();
                    s.Va();
                    s.usePlugins && s.doPlugins && s.doPlugins(s);
                    if (s.account) {
                        if (!s.abort) {
                            if (s.trackOffline && !s.timestamp) s.timestamp = Math.floor(e.getTime() /
                                1E3);
                            e = w.location;
                            if (!s.pageURL) s.pageURL = e.href ? e.href : e;
                            if (!s.referrer && !s.ra) s.referrer = m.document.referrer, s.ra = 1;
                            s.referrer = s.Ia(s.referrer);
                            s.q("_g")
                        }
                        s.Ma() && !s.abort && (s.Na(), f += s.La(), s.Ua(d, f));
                        s.abort || s.q("_t")
                    }
                }
                b && s.I(c, 1)
            }
            s.timestamp = s.linkObject = s.j = s.linkURL = s.linkName = s.linkType = w.mb = s.pe = s.pev1 = s.pev2 = s.pev3 = s.g = 0
        }
    };
    s.tl = s.trackLink = function (b, a, c, e, d) {
        s.linkObject = b;
        s.linkType = a;
        s.linkName = c;
        if (d) s.i = b, s.p = d;
        return s.track(e)
    };
    s.trackLight = function (b, a, c, e) {
        s.lightProfileID = b;
        s.lightStoreForSeconds =
            a;
        s.lightIncrementBy = c;
        return s.track(e)
    };
    s.clearVars = function () {
        var b, a;
        for (b = 0; b < s.e.length; b++)
            if (a = s.e[b], a.substring(0, 4) == "prop" || a.substring(0, 4) == "eVar" || a.substring(0, 4) == "hier" || a.substring(0, 4) == "list" || a == "channel" || a == "events" || a == "eventList" || a == "products" || a == "productList" || a == "purchaseID" || a == "transactionID" || a == "state" || a == "zip" || a == "campaign") s[a] = void 0
    };
    s.Ua = function (b, a) {
        var c, e = s.trackingServer;
        c = "";
        var d = s.dc,
            f = "sc.",
            w = s.visitorNamespace;
        if (e) {
            if (s.trackingServerSecure && s.ssl) e =
                s.trackingServerSecure
        } else {
            if (!w) w = s.account, e = w.indexOf(","), e >= 0 && (w = w.gb(0, e)), w = w.replace(/[^A-Za-z0-9]/g, "");
            c || (c = "2o7.net");
            d = d ? ("" + d).toLowerCase() : "d1";
            c == "2o7.net" && (d == "d1" ? d = "112" : d == "d2" && (d = "122"), f = "");
            e = w + "." + d + "." + f + c
        }
        c = s.ssl ? "https://" : "http://";
        c += e + "/b/ss/" + s.account + "/" + (s.mobile ? "5." : "") + "1/JS-" + s.version + (s.ab ? "T" : "") + "/" + b + "?AQB=1&ndh=1&" + a + "&AQE=1";
        s.Pa && (c = c.substring(0, 2047));
        s.Ga(c);
        s.N()
    };
    s.Ga = function (b) {
        s.c || s.Oa();
        s.c.push(b);
        s.O = s.r();
        s.pa()
    };
    s.Oa = function () {
        s.c =
            s.Ra();
        if (!s.c) s.c = []
    };
    s.Ra = function () {
        var b, a;
        if (s.T()) {
            try {
                (a = w.localStorage.getItem(s.R())) && (b = w.JSON.parse(a))
            } catch (c) {}
            return b
        }
    };
    s.T = function () {
        var b = !0;
        if (!s.trackOffline || !s.offlineFilename || !w.localStorage || !w.JSON) b = !1;
        return b
    };
    s.ga = function () {
        var b = 0;
        if (s.c) b = s.c.length;
        s.v && b++;
        return b
    };
    s.N = function () {
        if (!s.v)
            if (s.ha = k, s.S) s.O > s.F && s.na(s.c), s.V(500);
            else {
                var b = s.Ba();
                if (b > 0) s.V(b);
                else if (b = s.ea()) s.v = 1, s.Ta(b), s.Ya(b)
            }
    };
    s.V = function (b) {
        if (!s.ha) b || (b = 0), s.ha = setTimeout(s.N, b)
    };
    s.Ba =
        function () {
            var b;
            if (!s.trackOffline || s.offlineThrottleDelay <= 0) return 0;
            b = s.r() - s.la;
            if (s.offlineThrottleDelay < b) return 0;
            return s.offlineThrottleDelay - b
        };
    s.ea = function () {
        if (s.c.length > 0) return s.c.shift()
    };
    s.Ta = function (b) {
        if (s.debugTracking) {
            var a = "AppMeasurement Debug: " + b;
            b = b.split("&");
            var c;
            for (c = 0; c < b.length; c++) a += "\n\t" + s.unescape(b[c]);
            s.Sa(a)
        }
    };
    s.Ya = function (b) {
        var a;
        if (!a) a = new Image, a.alt = "";
        a.ba = function () {
            try {
                if (s.U) clearTimeout(s.U), s.U = 0;
                if (a.timeout) clearTimeout(a.timeout), a.timeout =
                    0
            } catch (b) {}
        };
        a.onload = a.$a = function () {
            a.ba();
            s.Fa();
            s.K();
            s.v = 0;
            s.N()
        };
        a.onabort = a.onerror = a.Ha = function () {
            a.ba();
            (s.trackOffline || s.S) && s.v && s.c.unshift(s.Ea);
            s.v = 0;
            s.O > s.F && s.na(s.c);
            s.K();
            s.V(500)
        };
        a.onreadystatechange = function () {
            a.readyState == 4 && (a.status == 200 ? a.$a() : a.Ha())
        };
        s.la = s.r();
        a.src = b;
        if (a.abort) s.U = setTimeout(a.abort, 5E3);
        s.Ea = b;
        s.jb = w["s_i_" + s.replace(s.account, ",", "_")] = a;
        if (s.useForcedLinkTracking && s.A || s.p) {
            if (!s.forcedLinkTrackingTimeout) s.forcedLinkTrackingTimeout = 250;
            s.L = setTimeout(s.K,
                s.forcedLinkTrackingTimeout)
        }
    };
    s.Fa = function () {
        if (s.T() && !(s.ka > s.F)) try {
            w.localStorage.removeItem(s.R()), s.ka = s.r()
        } catch (b) {}
    };
    s.na = function (b) {
        if (s.T()) {
            s.pa();
            try {
                w.localStorage.setItem(s.R(), w.JSON.stringify(b)), s.F = s.r()
            } catch (a) {}
        }
    };
    s.pa = function () {
        if (s.trackOffline) {
            if (!s.offlineLimit || s.offlineLimit <= 0) s.offlineLimit = 10;
            for (; s.c.length > s.offlineLimit;) s.ea()
        }
    };
    s.forceOffline = function () {
        s.S = !0
    };
    s.forceOnline = function () {
        s.S = !1
    };
    s.R = function () {
        return s.offlineFilename + "-" + s.visitorNamespace +
            s.account
    };
    s.r = function () {
        return (new Date).getTime()
    };
    s.ia = function (s) {
        s = s.toLowerCase();
        if (s.indexOf("#") != 0 && s.indexOf("about:") != 0 && s.indexOf("opera:") != 0 && s.indexOf("javascript:") != 0) return !0;
        return !1
    };
    s.setTagContainer = function (b) {
        var a, c, e;
        s.ab = b;
        for (a = 0; a < s._il.length; a++)
            if ((c = s._il[a]) && c._c == "s_l" && c.tagContainerName == b) {
                s.I(c);
                if (c.lmq)
                    for (a = 0; a < c.lmq.length; a++) e = c.lmq[a], s.loadModule(e.n);
                if (c.ml)
                    for (e in c.ml)
                        if (s[e])
                            for (a in b = s[e], e = c.ml[e], e)
                                if (!Object.prototype[a] && (typeof e[a] !=
                                    "function" || ("" + e[a]).indexOf("s_c_il") < 0)) b[a] = e[a];
                if (c.mmq)
                    for (a = 0; a < c.mmq.length; a++) e = c.mmq[a], s[e.m] && (b = s[e.m], b[e.f] && typeof b[e.f] == "function" && (e.a ? b[e.f].apply(b, e.a) : b[e.f].apply(b)));
                if (c.tq)
                    for (a = 0; a < c.tq.length; a++) s.track(c.tq[a]);
                c.s = s;
                break
            }
    };
    s.Util = {
        urlEncode: s.escape,
        urlDecode: s.unescape,
        cookieRead: s.cookieRead,
        cookieWrite: s.cookieWrite,
        getQueryParam: function (b, a, c) {
            var e;
            a || (a = s.pageURL ? s.pageURL : w.location);
            c || (c = "&");
            if (b && a && (a = "" + a, e = a.indexOf("?"), e >= 0 && (a = c + a.substring(e +
                1) + c, e = a.indexOf(c + b + "="), e >= 0 && (a = a.substring(e + c.length + b.length + 1), e = a.indexOf(c), e >= 0 && (a = a.substring(0, e)), a.length > 0)))) return s.unescape(a);
            return ""
        }
    };
    s.H = ["timestamp", "dynamicVariablePrefix", "visitorID", "marketingCloudVisitorID", "analyticsVisitorID", "audienceManagerVisitorID", "audienceManagerLocationHint", "fid", "vmk", "visitorMigrationKey", "visitorMigrationServer", "visitorMigrationServerSecure", "charSet", "visitorNamespace", "cookieDomainPeriods", "fpCookieDomainPeriods", "cookieLifetime", "pageName",
        "pageURL", "referrer", "contextData", "currencyCode", "lightProfileID", "lightStoreForSeconds", "lightIncrementBy", "retrieveLightProfiles", "deleteLightProfiles", "retrieveLightData", "pe", "pev1", "pev2", "pev3", "pageURLRest"
    ];
    s.e = s.H.concat(["purchaseID", "variableProvider", "channel", "server", "pageType", "transactionID", "campaign", "state", "zip", "events", "events2", "products", "tnt"]);
    s.ma = ["timestamp", "charSet", "visitorNamespace", "cookieDomainPeriods", "cookieLifetime", "contextData", "lightProfileID", "lightStoreForSeconds",
        "lightIncrementBy"
    ];
    s.P = s.ma.slice(0);
    s.$ = ["account", "allAccounts", "debugTracking", "visitor", "trackOffline", "offlineLimit", "offlineThrottleDelay", "offlineFilename", "usePlugins", "doPlugins", "configURL", "visitorSampling", "s.visitorSamplingGroup", "linkObject", "linkURL", "linkName", "linkType", "trackDownloadLinks", "trackExternalLinks", "trackClickMap", "trackInlineStats", "linkLeaveQueryString", "linkTrackVars", "linkTrackEvents", "linkDownloadFileTypes", "linkExternalFilters", "linkInternalFilters", "useForcedLinkTracking",
        "forcedLinkTrackingTimeout", "trackingServer", "trackingServerSecure", "ssl", "abort", "mobile", "dc", "lightTrackVars", "maxDelay"
    ];
    for (i = 0; i <= 75; i++) s.e.push("prop" + i), s.P.push("prop" + i), s.e.push("eVar" + i), s.P.push("eVar" + i), i < 6 && s.e.push("hier" + i), i < 4 && s.e.push("list" + i);
    i = ["resolution", "colorDepth", "javascriptVersion", "javaEnabled", "cookiesEnabled", "browserWidth", "browserHeight", "connectionType", "homepage", "plugins"];
    s.e = s.e.concat(i);
    s.H = s.H.concat(i);
    s.ssl = w.location.protocol.toLowerCase().indexOf("https") >=
        0;
    s.charSet = "UTF-8";
    s.contextData = {};
    s.offlineThrottleDelay = 0;
    s.offlineFilename = "AppMeasurement.offline";
    s.la = 0;
    s.O = 0;
    s.F = 0;
    s.ka = 0;
    s.linkDownloadFileTypes = "exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx";
    s.w = w;
    s.d = w.document;
    try {
        s.Pa = navigator.appName == "Microsoft Internet Explorer"
    } catch (o) {}
    s.K = function () {
        if (s.L) w.clearTimeout(s.L), s.L = k;
        s.i && s.A && s.i.dispatchEvent(s.A);
        if (s.p)
            if (typeof s.p == "function") s.p();
            else if (s.i && s.i.href) s.d.location = s.i.href;
        s.i = s.A = s.p = 0
    };
    s.oa = function () {
        s.b =
            s.d.body;
        if (s.b)
            if (s.o = function (b) {
                var a, c, e, d, f;
                if (!(s.d && s.d.getElementById("cppXYctnr") || b && b.Wa)) {
                    if (s.aa)
                        if (s.useForcedLinkTracking) s.b.removeEventListener("click", s.o, !1);
                        else {
                            s.b.removeEventListener("click", s.o, !0);
                            s.aa = s.useForcedLinkTracking = 0;
                            return
                        } else s.useForcedLinkTracking = 0;
                    s.j = b.srcElement ? b.srcElement : b.target;
                    try {
                        if (s.j && (s.j.tagName || s.j.parentElement || s.j.parentNode))
                            if (e = s.ga(), s.track(), e < s.ga() && s.useForcedLinkTracking && b.target) {
                                for (d = b.target; d && d != s.b && d.tagName.toUpperCase() !=
                                    "A" && d.tagName.toUpperCase() != "AREA";) d = d.parentNode;
                                if (d && (f = d.href, s.ia(f) || (f = 0), c = d.target, b.target.dispatchEvent && f && (!c || c == "_self" || c == "_top" || c == "_parent" || w.name && c == w.name))) {
                                    try {
                                        a = s.d.createEvent("MouseEvents")
                                    } catch (g) {
                                        a = new w.MouseEvent
                                    }
                                    if (a) {
                                        try {
                                            a.initMouseEvent("click", b.bubbles, b.cancelable, b.view, b.detail, b.screenX, b.screenY, b.clientX, b.clientY, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey, b.button, b.relatedTarget)
                                        } catch (i) {
                                            a = 0
                                        }
                                        if (a) a.Wa = 1, b.stopPropagation(), b.Za && b.Za(), b.preventDefault(),
                                            s.i = b.target, s.A = a
                                    }
                                }
                            }
                    } catch (k) {}
                    s.j = 0
                }
            }, s.b && s.b.attachEvent) s.b.attachEvent("onclick", s.o);
            else {
                if (s.b && s.b.addEventListener) {
                    if (navigator && (navigator.userAgent.indexOf("WebKit") >= 0 && s.d.createEvent || navigator.userAgent.indexOf("Firefox/2") >= 0 && w.MouseEvent)) s.aa = 1, s.useForcedLinkTracking = 1, s.b.addEventListener("click", s.o, !0);
                    s.b.addEventListener("click", s.o, !1)
                }
            } else setTimeout(s.oa, 30)
    };
    s.oa()
}

function s_gi(s) {
    var w, k = window.s_c_il,
        m, i = s.split(","),
        n, p, o = 0;
    if (k)
        for (m = 0; !o && m < k.length;) {
            w = k[m];
            if (w._c == "s_c" && w.account)
                if (w.account == s) o = 1;
                else {
                    if (!w.allAccounts) w.allAccounts = w.account.split(",");
                    for (n = 0; n < i.length; n++)
                        for (p = 0; p < w.allAccounts.length; p++) i[n] == w.allAccounts[p] && (o = 1)
                }
            m++
        }
    o || (w = new AppMeasurement);
    w.setAccount(s);
    return w
}
AppMeasurement.getInstance = s_gi;
window.s_objectID || (window.s_objectID = 0);

function s_pgicq() {
    var s = window,
        w = s.s_giq,
        k, m, i;
    if (w)
        for (k = 0; k < w.length; k++) m = w[k], i = s_gi(m.oun), i.setAccount(m.un), i.setTagContainer(m.tagContainerName);
    s.s_giq = 0
}
s_pgicq();

