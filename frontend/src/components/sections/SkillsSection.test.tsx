import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SkillsSection } from './SkillsSection';
import { portfolioContent } from '../../data/content';

describe('SkillsSection', () => {
  it('renders all eight skill categories and their requested technologies', () => {
    const markup = renderToStaticMarkup(React.createElement(SkillsSection));

    expect(markup).toContain('id="section-04"');
    expect(markup).toContain('SKILLS &amp;');
    expect(markup).toContain('TECHNOLOGIES');

    for (const category of portfolioContent.skills) {
      expect(markup).toContain(category.number);
      expect(markup).toContain(category.title.replace('&', '&amp;'));

      for (const skill of category.skills) {
        expect(markup).toContain(skill.name);
      }
    }

    expect(portfolioContent.skills).toHaveLength(8);
  });
});
