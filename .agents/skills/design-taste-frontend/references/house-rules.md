# House Rules Reference

## House rules

These hold on every build, whatever the direction. `inspect.mjs` measures them.

| Rule | Instead |
| --- | --- |
| **Headlines: two lines or fewer, at every width.** Every `h1`–`h6`, and the main line of the first screen whatever its tag. | Cut words. Then widen the measure. Size last. |
| **A clear title on the first screen**, in the page's one `h1`, and a heading on every section. | Say what this is: the name with what it does, the product with what it is for, the event with its date and place. |
| **Equal outer margins; no section huddled on one side** with the other half of the screen empty. | Close every void with something on its far side: the section's picture, a second column, a list, a figure. |
| **No blank stretches** taller than about half a screen. | The normal section gap. A deliberate rest is a placed picture or a field of colour, once per page. |
| **Statements are paragraphs.** An intro sentence or a quotation set large is marked up as `<p>` or `<blockquote>`, stays at statement size (36px or less on desktop, 24px on a phone) and runs to about 25 words, three lines. | Larger than that it is a headline and the two-line rule applies. In blind tests jurors read a 42px sentence over four lines as a four-line headline. |
| **No eyebrows.** No small label above a heading, no pill badge above the headline, no "New ·" chip. | Put the information in the heading or the first sentence, or drop it. |
| **No monospace** outside real code blocks. | The text face. Tabular figures where numbers align. |
| **No index numbering.** No 01 / 02 / 03, no (001), no "Step 2". | Order shown by position, size, or the words. A real `<ol>` if order matters. |
| **No thin rules.** No hairline dividers, no 1px outlined boxes, no grid lines, crosshairs or crop marks. | Space. A step in background tone. A change of scale. A filled shape. |
| **No gradients.** Not as backgrounds, not on buttons, not in text. | Flat colour, or a real photograph. A neutral scrim under text on a photo is the one exception. |
| **No shadows on things at rest.** No glows. | A tone step between surfaces. Shadows only on what truly floats: a menu, a dialog. |
| **No assistant palette.** No yellow-cream ground with terracotta or rust; no violet or indigo. | The dealt palette. |
| **No tiny uppercase letter-spaced labels.** | Sentence case at a readable size. |
| **No icon-topped feature cards, no rows of identical cards.** | The dealt section blueprint. |
| **No glass.** No backdrop blur panels, no floating pill navigation. | A plain bar: wordmark, a few links, one action. |
| **No emoji, no gradient blobs, no decorative shapes, no fake dashboards of grey bars.** | A real picture, a real interface fragment, or nothing. |
| **No styled accent word** in a headline (italic, serif, coloured, underlined). | One face, one colour. The words carry the emphasis. |
| **Two typefaces at most,** usually one. | The dealt type system. |

Three places keep their own conventions and are left alone by the inspector: real code in
`<pre>`/`<code>` (monospace is correct there), real tables and form fields (they may have lines), and
a real interface fragment whose root carries the attribute `data-ui` (the product's own borders and
menus; see `references/imagery.md` §7).

Why these, honestly. Some are what the study measured: among the 247 sites, those the panel scored
7.5 or higher used icon feature cards 1% of the time against 28% for sites under 6.5, pill badges 14%
against 34%, gradients 22% against 52%, shadows 24% against 48%, tiny tracked caps 16% against 57%.
Others are the owner's taste and go against current gallery fashion: monospace labels, index numbers
and hairline grids are actually *more* common on award sites than on weak ones, which is exactly why
generators imitate them and why they now read as costume. They are banned here without exception.
`references/tells.md` keeps the dated registry.

Removing ornament leaves space. Never fill it with another ornament. Fill it with scale (make the main
thing larger), with the full content, with a picture made for this subject, or with a field of flat
colour. Leave it empty on purpose once per page at most.

