import {test,expect} from '@playwright/test';
test('scene loads, controls work, credits and sound respond',async({page},info)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto('./');await expect(page.locator('#enter')).toBeEnabled();await expect(page.locator('#error')).toBeHidden();
 await expect(page.locator('#world')).toHaveAttribute('data-actors','6');
 await page.screenshot({path:`test-results/${info.project.name}-title.png`});
 await page.locator('#enter').click();await page.locator('#skip').click();await expect(page.locator('body')).toHaveClass(/entered/);await expect(page.locator('body')).not.toHaveClass(/intro/);
 await page.screenshot({path:`test-results/${info.project.name}-scene.png`});
 await page.locator('#sound').click();await expect(page.locator('#sound')).toHaveAttribute('aria-pressed','true');await page.locator('#sound').click();await expect(page.locator('#sound')).toHaveAttribute('aria-pressed','false');
 await page.locator('#settings').click();await page.locator('#quality').selectOption('Low');await expect(page.locator('#world')).toHaveAttribute('data-quality','Low');await page.locator('#reset').click();
 await page.locator('#about').click();await expect(page.locator('#credits')).toContainText('Amir Saeid Dehghan');await expect(page.locator('#credits')).toContainText('not affiliated');await page.getByRole('button',{name:'Close credits'}).click();
 if(info.project.name==='mobile'){await expect(page.locator('#joystick')).toBeVisible();const b=await page.locator('#joystick').boundingBox();expect(b.x).toBeGreaterThanOrEqual(0);}else{await page.locator('#world').focus();await page.keyboard.down('KeyW');await page.waitForTimeout(800);await page.keyboard.up('KeyW');}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(errors).toEqual([]);
});
test('missing model does not trap loading',async({page})=>{await page.route('**/assets/models/investigator.glb',route=>route.fulfill({status:404,body:'missing'}));await page.goto('./');await expect(page.locator('#enter')).toBeEnabled();await expect(page.locator('#load-status')).toContainText('unavailable');await expect(page.locator('#error')).toBeHidden();});
test('unsupported WebGL has a clear fallback',async({page})=>{await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/i.test(type)?null:original.call(this,type,...args);};});await page.goto('./');await expect(page.locator('#error')).toBeVisible();await expect(page.locator('#error-message')).toContainText('WebGL');});
