$path = "c:\Anti-Gravity Skills\bon-sqd\_assets\layout\_team.scss"
$content = @"
@use '../abstracts' as *;

// Golden ratio helper: width = 1.618 × height
$team-card-ratio: 1.618;

// Modernised team / contact cards
.team-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2.5rem;
}

.team-member {
  display: flex;
  flex-direction: column;
  background: `$white;
  border-radius: 16px;
  box-shadow: `$shadow-md;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;

  // Golden ratio width based on a ~200px tall image (top portion)
  width: 324px;   // ~200px × 1.618

  // Subtle accent stripe inside the image area
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, `$color-primary, lighten(`$color-primary, 15%));
    z-index: 2;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(`$color-black, 0.14);

    img {
      transform: scale(1.04);
    }
  }

  // Cover-style image taking the top 40% of the card
  img {
    width: 100%;
    height: 210px;               // ~40% of card height
    object-fit: cover;
    object-position: top center;
    border-radius: 16px 16px 0 0;
    border: none;
    box-shadow: none;
    transition: transform 0.4s ease;
    display: block;
  }

  // Content area below the image
  .card-body {
    padding: 1.5rem 1.5rem 1.75rem;
    text-align: center;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h4 {
    margin: 0.75rem 0 0.2rem;
    font-size: 1.3rem;
    font-weight: 700;
    color: `$color-text;
  }

  .role {
    margin: 0 0 0.9rem;
    font-size: 0.9rem;
    color: `$gray-600;
    font-weight: 400;

    &::before {
      content: '·';
      color: `$color-primary;
      font-weight: 700;
      margin-right: 0.35em;
    }
  }

  .social-buttons {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.25rem;
    padding: 0;
    list-style: none;

    a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: rgba(`$color-primary, 0.1);
      color: `$color-primary;
      border-radius: 50%;
      font-size: 0.9rem;
      transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease;

      &:hover {
        background: `$color-primary;
        color: `$white;
        transform: translateY(-2px);
      }
    }
  }
}

// Overrides for testimonials section – keeps modern base, adjusts for embedded cards
#testimonials {
  position: relative;
  padding: 2.5rem 0;
  width: 100%;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('/assets/Background.png');
    background-repeat: repeat;
    background-size: 250px auto;
    opacity: 0.2;
    z-index: -1;
  }

  .team-member {
    // Keep the same modern base, but hide the accent stripe
    &::after {
      display: none;
    }

    img {
      width: 100%;
      height: 210px;
      border-radius: 16px 16px 0 0;
      border: none;
      box-shadow: none;
    }

    h4,
    h5 {
      margin: 0.75rem 0 0.2rem;
      font-size: 1.3rem;
      font-weight: 700;
      color: `$color-text;
    }

    p {
      font-style: italic;
      color: `$color-text;
      margin: 0.75rem 0 0;
      line-height: 1.6;
    }
  }
}
"@
$tmp = "c:\Anti-Gravity Skills\bon-sqd\_assets\layout\_team_tmp.scss"
Set-Content $tmp -Value $content -NoNewline
Remove-Item $path
Move-Item $tmp $path
Write-Host "Done"
