# Simple B2G Shell without Too Much Historical Burden

Yes, Gaia is unavoidable becoming too complex for an unseen developer who
understands no mysterious UX and only want a simple shell. Although this is
actually a good thing because we have made so much mistakes and tried lots of
paths lead to nothing. All of these can be the solid ground for a better future.

Nevertheless, it still has too much compromises and dirty workarounds left
by people care no architecture issues but only want to finish the work. We've
been tortured by these sad code everyday and do lots of refactoring to try
to make things become better. It sometime works well, but unfortunately the
other parts of our components are still growing with the monstrous styles
and the continuing careless patches. Think about what if we can get rid of
these messes and start to develop again, and this time even it may never
be a product with commercial success, but we can finally create and hold
our peaceful land to see how powerful or awful our underlying platform is,
in a different but healthy way.

So, this project would never replace Gaia and it's a very personal project,
with the following very personal principles of developments:

1. If our architecture can't afford UX features, don't do that until we can
fix and extend the architecture. In Gaia there are too much ridiculous code
exist only because people can't, or even worse, don't like to find a good
and unified way to implement the feature, within a theoretical powerful enough
architecture.

2. Rewriting all things should not be blamed, especially when this is for an
architecture change. Every time we hit the wall we may discover the limits of
our architecture. Sometimes we can still extend it to fit the needs, but if
situation is bad we should be allowed to get rid of whole things and start
again, with a much better plan.

3. If platform sucks, do no workarounds for features. Some APIs just not mature
enough to support features, and thus the shell should stop to support the
relevant features until platform is ready. For example, if orientation API is
so problematic when app is in background, kill untrusted background apps to
avoid the issue. To be radical hurts nothing in this pure personal project.

4. Supports nothing if we can't make sure there is no intermittent errors during
test. If our code leads to intermittent failures the feature should be suspended,
until we can find the root cause and make sure each small step is robust enough.

The current goal is to avoid modify Gaia code but create a new, launch-able System
app 'Core'. In the Core environment we can test all new things without be bothered
by other legacy components and build scripts. We would not remove Gaia in the code
base unless we can make sure the architecture is robust enough.
