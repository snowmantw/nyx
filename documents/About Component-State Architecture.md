# Principles

1. Components are initial state of the state diagram

2. Components hold 'properties', or 'inner states' for the current State

3. Component-State handle events, and transfer to another State if we must
handle different set of events, or with different ways to handle them. This
is by-design, but one principle is if we put lots of switch-cases or if...else
in our handing logic, we should decouple them and generate another state to
transfer to.

4. For the practical reason use we pass the 'inner states' to next State.
However, don't abuse this. The better way to use them is treat them as a cache,
and have the method to re-fetch them if they're out of date or missing.

5. We have sub-components, yes. This is for encapsulation and preventing to
have too much States in the same level. Each sub-component should be treated
as a sub-statemachine, and receive and handle the events by their own. The
parent component only need to know to initialize and finalize them, and for
convenience we pass our inner-states to sub-components so they don't need to
fetch them all again. However, even it's impractical to freeze the inner-states
for technical reasons, sub-components should avoid directly change the states
from the parent component.

6. All steps are assumed as asynchronous, and would be executed only within a
main Promise, which ensure there is no unexpected racing.
