---
title: "Overcoming Code Format Disputes"
date: 2023-04-03T19:38:58+02:00
keywords: "tabs vs. spaces, line length, soft line wrap, align consecutive assignments, grabenkampf"
categories: [code]
comments: true
---

Superficially, this article is just about coding style “Grabenkämpfe”[^grabenkampf]. At its core, though, it goes into breaking the circle, understanding your counterpart, being honest about own misconceptions, finding real, constructive middle ground. On a meta-level, we might even take away inspiration for solving everyday life conflicts beyond code style bike-shedding.

[^grabenkampf]: “Grabenkampf” literally means _trench warfare_. In German it also has a [metaphorical meaning](https://de.wikipedia.org/wiki/Grabenkrieg#Figurative_Bedeutung) of long-lasting arguments without real progress.

## Dare You Questioning My Style!

A while ago, a colleague of mine challenged [my habit to hard-break long lines of prose in Markdown files](https://github.com/smnscp/similitude-hugo/blob/096261f80997dcc6bc6b7f4d69352dfc43aa24d2/.prettierrc#L19).

<!-- prettier-ignore-start -->
{{< highlight json ".prettierrc" >}}
{
  "overrides": [
    {
      "files": [
        "*.md"
      ],
      "options": {
        "parser": "markdown",
        "proseWrap": "always"
      }
    }
  ]
}
{{< / highlight >}}
<!-- prettier-ignore-end -->

She said, with soft-wrap turned on, her code editor is taking care of wrapping long lines automatically. And so, not only doesn’t she see any use in hard-wrapping lines, but it’s also spoiling her editor’s effort to display the text in a convenient way.

I could have given in to the impulse to react annoyed to this perceivedly negligible expression of opinion on a supposedly pure matter of taste. But I didn’t.

## Re-thinking Prose Wrap

Instead, I revised my reasoning for settling on hard wraps and realized that my colleague was totally right and I was wrong.

Essentially, I had got two reasons: Readability and containment of changes. The former is obvious: [Short lines of text are readable](http://webtypography.net/2.1.2), long lines are not. The latter is a bit obscure: In version control, changes are better traceable if they affect only a short line rather than a whole paragraph. That’s what I thought.

Well, I should have thought twice. Both my needs turned out to be even better met with soft wrap. Readability (in terms of comfortable line length) is not an issue with soft wrap turned on. One thing that always kept me from relying on soft wrap was that indented lines where turned into a mess. But that’s no longer the case if you use a modern editor that’s taking care of proper indentation of subsequent lines. And when it comes to keeping changes contained to a single short line I had not taken into account that most wording changes would cause re-wrapping of the whole paragraph, anyways. And most diff tools do a good job in visualizing inline changes.

After all, there is no real advantage in hard line breaks solely for formatting. They are actually just an overhead.

Ah, wait, I forgot: Of course, restricting line-length is something [you just do](https://llvm.org/docs/CodingStandards.html#source-code-width), no matter what, isn’t it? Well, turns out that Markdown files (and others with long prose contents) are a perfect exception from that rule. Just because I write them in the same editor I use for program code doesn’t mean I cannot handle them differently. In fact, they _are_ different. But some similarity also exists …

## Code Formatting: Different but Same

A few weeks later I stumbled upon some lines of code with inline tabular alignment: A group of consecutive assignments with the equal signs all pushed to the same column by bunches of extra spaces.

<!-- prettier-ignore-start -->
{{< highlight ruby "consecutive assignments, rather unrelated" >}}
  some_var                          = 42
  another_var                       = "foo"
  now                               = Time.now
  yet_another_thing_being_initiated = request
{{< / highlight >}}
<!-- prettier-ignore-end -->

By “stumble upon” I don’t mean being hit by surprise. Rather, it reminded me of that un-written convention in our team to treat our Ruby code with that kind of “cosmetics”. I’m well aware that some colleagues fancy it due to the assumed better readability. Not me! I don’t. I read code line by line, not column-wise. And I hate to introduce unnecessary formatting dependencies between lines. But not _only_ me! Look at popular code style guides out there: <i>PEP&nbsp;8</i>, for example, [lists this no-no under “Pet Peeves”](https://pep8.org/#pet-peeves). Need I say more?

Nevertheless, I normally refrain from starting discussions about things like that, because I know that those arguments are usually fruitless. People have different needs and priorities. Trying to convince each other is mostly weighing in your own needs more important than those of your counterpart. It would only go like this:

<figure class="no-outdent">

  _They_: “I like the readability gain of aligning consecutive assignments or multi-line dictionaries.”
  
  _I_: “I don’t want those lines’ formatting to depend on each other’s. It means extra effort and leads to formatting war. And by the way, I despise the alleged readability gain, because it’s at best a slight one.”
  
  — “I don’t care about the extra formatting effort. Tooling can do this automatically. Readability of code is more important then its maintainability. And the readability improvement is huge!”
  
  — “No, it’s not. If it is for you, then that’s only subjective. For me it’s actually the opposite. It disturbs my reading flow. It provokes merge conflicts due to different amounts of spaces added or removed in both versions. It obscures code history.”
  
  — “I have a plug-in that aligns touched lines automatically after resolving merge conflicts. And I don’t care much about code history. If you do, there is [a git-blame option](https://git-scm.com/docs/git-blame#Documentation/git-blame.txt--w) that filters out whitespace-only changes.”
  
  — “It hurts my eyes!”
  
  — “I like it!”
  
  — “It hurts my feelings!”
  
  — “You hurt mine!”
  
  …
</figure>

You see, it’s futile. You can follow [discussions like that](https://stackoverflow.com/questions/101958/code-formatting-is-lining-up-similar-lines-ok) and will find similar statements everywhere. Both sides have their reasons and neither side will probably ever convince the other.

I’ve been using [Prettier](https://prettier.io/) in most of my personal projects for the last 5 years. And I’m happy we eventually introduced it for all our front-end code at work. The main simple reason why I love it:

> No need to discuss style in code review

<small>(And there will never be extraneous whitespace in our TypeScript code. 😌)</small>

On the other hand, I understand why others like that tabular style. Putting things in rectangular boxes has always brought some kind of comfort to humans. And the fact that code formatters have dedicated options for it (e. g. [`AlignConsecutiveDeclarations` for Clang-Format](https://clang.llvm.org/docs/ClangFormatStyleOptions.html#alignconsecutiveassignments)) shows that it’s really important to some and accepted by many.

Realizing that I can never convince them to abandon that habit, and they will never make me love it, I wondered what could be a possible middle ground: Giving them their reading comfort while keeping formatting conflicts out of the shared codebase.

## Filling `\t` softly

And that was when the scales fell from my eyes: This problem is not much unlike the one described in the first part. Applying soft line wrap is just one form of on-the-fly formatting in order to achieve a presentation of contents that optimally fits the output medium and the reader’s preferences. Why not do the same with tabular code alignment? Instead of “hard-coding” those extra spaces, just tell your editor which patterns you want to have aligned. And it shall present you the code just the way you like it. While your team-mates don’t have to cope with format-induced merge conflicts, lines depending on each other’s spacing, reading-flow-breaking gaps, and so on.

And guess what! I was not the first one who came up with that idea. A VS Code plug-in already exists since 2021: [Align-Spaces by OldStarchy](https://github.com/OldStarchy/Align-Spaces).

> Aligns certain operators by visually stretching the leading characters, this way you can have groups of aligned code, without having to deal with meaningless whitespace changes in your commits.

I gave it a quick try and it works pretty well. Sure, there’s room for improvement. But anyways, it’s great idea and a good implementation. I wonder if there are others for different editors. If you happen to know one, please add it in a comment!

I think, this kind of responsive code presentation might be the key to solve a lot of conflicts in the bike-shedding and “Grabenkampf” areas of software development. Next time, let’s talk about **Tabs vs. Spaces** 😁
